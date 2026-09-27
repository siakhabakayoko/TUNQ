import { GoogleGenAI } from '@google/genai';
import { getSectorById, getRegionById, getIhpcData, getSalaryProfiles } from '@/lib/ansd-service';
import { SectorId, RegionId, CountryCode } from '@/types';

export interface PricingSuggestionInput {
  title: string;
  description?: string;
  sectorId: SectorId;
  regionId: RegionId;
  isUemoaExportTarget?: boolean;
  uemoaTargetCountry?: CountryCode;
}

export interface PricingSuggestionOutput {
  suggestedUnitPriceFcfa: number;
  suggestedUnitCostFcfa: number;
  suggestedMonthlyFixedCostsFcfa: number;
  suggestedMonthlySalesVolume: number;
  grossMarginPct: number;
  rationale: string;
  ansdBenchmarks: {
    sectorName: string;
    sectorMarginPct: number;
    regionalIncomeFcfa: number;
    regionalPurchasingTier: string;
    regionalPopulation: number;
    inflationRatePct: number;
  };
  source: 'gemini_ai' | 'ansd_calibrated';
}

interface SectorPricingBaseline {
  basePrice: number;
  targetMargin: number;
  baseFixedCosts: number;
  baseVolume: number;
}

const SECTOR_BASELINES: Record<SectorId, SectorPricingBaseline> = {
  TECH_DIGITAL: {
    basePrice: 25000,
    targetMargin: 0.585,
    baseFixedCosts: 650000,
    baseVolume: 120,
  },
  AGRO_INDUSTRY: {
    basePrice: 3500,
    targetMargin: 0.34,
    baseFixedCosts: 450000,
    baseVolume: 1200,
  },
  COMMERCE_RETAIL: {
    basePrice: 15000,
    targetMargin: 0.215,
    baseFixedCosts: 380000,
    baseVolume: 350,
  },
  BTP_REALESTATE: {
    basePrice: 85000,
    targetMargin: 0.36,
    baseFixedCosts: 950000,
    baseVolume: 45,
  },
  HEALTH_PHARMA: {
    basePrice: 7500,
    targetMargin: 0.435,
    baseFixedCosts: 550000,
    baseVolume: 350,
  },
  TRANSPORT_LOGISTICS: {
    basePrice: 18000,
    targetMargin: 0.305,
    baseFixedCosts: 750000,
    baseVolume: 180,
  },
  HOSPITALITY_FOOD: {
    basePrice: 8500,
    targetMargin: 0.48,
    baseFixedCosts: 550000,
    baseVolume: 220,
  },
  EDUCATION_TRAINING: {
    basePrice: 35000,
    targetMargin: 0.52,
    baseFixedCosts: 600000,
    baseVolume: 80,
  },
};

/**
 * Propose des prix et volumes d'équilibre calibrés sur les données de l'ANSD
 * (RGE-2, RGPH-5, IHPC, ENES) et assistés par Gemini 2.5 Flash si configuré.
 */
export async function suggestPricingWithAnsd(
  input: PricingSuggestionInput
): Promise<PricingSuggestionOutput> {
  const sector = getSectorById(input.sectorId);
  const region = getRegionById(input.regionId);
  const ihpc = getIhpcData();
  const enes = getSalaryProfiles();

  const inflationRate = ihpc.functions?.[0]?.change_yearly ?? 2.8;
  const regionalIncome = region.avg_monthly_income_fcfa ?? 250000;
  const purchasingPowerMultiplier = Math.max(0.65, Math.min(1.3, regionalIncome / 350000));
  const exportVolumeBoost = input.isUemoaExportTarget ? 1.4 : 1.0;

  const baseline = SECTOR_BASELINES[input.sectorId] || SECTOR_BASELINES.TECH_DIGITAL;

  // Calcul déterministe certifié ANSD
  const calibratedPrice = Math.round((baseline.basePrice * purchasingPowerMultiplier) / 100) * 100;
  const calibratedCost = Math.round((calibratedPrice * (1 - baseline.targetMargin)) / 100) * 100;
  const calibratedFixed = Math.round((baseline.baseFixedCosts * purchasingPowerMultiplier) / 5000) * 5000;
  const calibratedVolume = Math.round(baseline.baseVolume * exportVolumeBoost * (region.population / 2000000 + 0.5));

  const fallbackOutput: PricingSuggestionOutput = {
    suggestedUnitPriceFcfa: Math.max(100, calibratedPrice),
    suggestedUnitCostFcfa: Math.max(50, calibratedCost),
    suggestedMonthlyFixedCostsFcfa: Math.max(100000, calibratedFixed),
    suggestedMonthlySalesVolume: Math.max(10, calibratedVolume),
    grossMarginPct: Number(((1 - calibratedCost / calibratedPrice) * 100).toFixed(1)),
    rationale: `Calibré selon le RGE-2 de l'ANSD (marge sectorielle cible de ${(baseline.targetMargin * 100).toFixed(1)}%) et le recensement RGPH-5 pour la région de ${region.name} (revenu moyen ménage : ${regionalIncome.toLocaleString('fr-FR')} FCFA).`,
    ansdBenchmarks: {
      sectorName: sector.name,
      sectorMarginPct: sector.avg_gross_margin_pct,
      regionalIncomeFcfa: regionalIncome,
      regionalPurchasingTier: region.purchasing_tier,
      regionalPopulation: region.population,
      inflationRatePct: inflationRate,
    },
    source: 'ansd_calibrated',
  };

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';

  if (!apiKey) {
    return fallbackOutput;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `Tu es l'économiste en chef et directeur financier du fonds TUNQ (Sénégal & UEMOA).
À partir des informations du projet et des statistiques officielles de l'ANSD (RGE-2, RGPH-5, IHPC, ENES), propose une structure tarifaire et financière réaliste, compétitive et pérenne sur le marché sénégalais.
Montants en FCFA (XOF).
Tu dois répondre UNIQUEMENT en JSON valide avec la structure suivante :
{
  "suggestedUnitPriceFcfa": number,
  "suggestedUnitCostFcfa": number,
  "suggestedMonthlyFixedCostsFcfa": number,
  "suggestedMonthlySalesVolume": number,
  "rationale": "Explication claire de 2 phrases justifiant les montants en citant le secteur ANSD, la marge RGE-2 et le pouvoir d'achat RGPH-5 régional."
}`;

    const userPrompt = `PROJET:
- Nom: "${input.title}"
- Description: "${input.description || 'Non précisée'}"
- Secteur ANSD: ${sector.name} (Marge brute moyenne RGE-2: ${sector.avg_gross_margin_pct}%, Survie 3 ans: ${sector.survival_rate_3yr}%)
- Région: ${region.name} (Population RGPH-5: ${region.population.toLocaleString('fr-FR')} hab., Revenu moyen: ${regionalIncome.toLocaleString('fr-FR')} FCFA, Niveau: ${region.purchasing_tier})
- Cible Export UEMOA: ${input.isUemoaExportTarget ? `Oui (${input.uemoaTargetCountry || 'Zone UEMOA'})` : 'Non (Marché domestique)'}
- Données de référence ANSD calculées:
  * Prix de base suggéré: ${calibratedPrice} FCFA
  * Coût de revient estimé: ${calibratedCost} FCFA
  * Charges fixes régionales estimées: ${calibratedFixed} FCFA
  * Volume mensuel cible estimé: ${calibratedVolume} unités

Propose des montants ajustés à la réalité spécifique du produit décrit dans le titre et la description, en respectant rigoureusement la marge brute saine du RGE-2 et le pouvoir d'achat local RGPH-5.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text?.trim();
    if (!text) return fallbackOutput;

    const parsed = JSON.parse(text);

    const price = Number(parsed.suggestedUnitPriceFcfa) || calibratedPrice;
    const cost = Number(parsed.suggestedUnitCostFcfa) || calibratedCost;
    const fixed = Number(parsed.suggestedMonthlyFixedCostsFcfa) || calibratedFixed;
    const volume = Number(parsed.suggestedMonthlySalesVolume) || calibratedVolume;

    const grossMargin = price > 0 ? Number(((price - cost) / price * 100).toFixed(1)) : 0;

    return {
      suggestedUnitPriceFcfa: Math.max(10, price),
      suggestedUnitCostFcfa: Math.max(5, cost),
      suggestedMonthlyFixedCostsFcfa: Math.max(50000, fixed),
      suggestedMonthlySalesVolume: Math.max(5, volume),
      grossMarginPct: grossMargin,
      rationale: parsed.rationale || fallbackOutput.rationale,
      ansdBenchmarks: fallbackOutput.ansdBenchmarks,
      source: 'gemini_ai',
    };
  } catch (error) {
    console.warn('[ANSD Pricing Suggestion] Gemini call fallback to ANSD calibrated algorithm:', error);
    return fallbackOutput;
  }
}
