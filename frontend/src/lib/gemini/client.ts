import { GoogleGenAI } from '@google/genai';
import type { GeminiEvaluationInput, GeminiEvaluationOutput } from './types';

/**
 * Génère l'évaluation stratégique à l'aide de Google Gemini API (gemini-2.5-flash)
 * avec injection directe du contexte macro-économique ANSD et UEMOA.
 * Si GEMINI_API_KEY n'est pas renseignée ou indisponible, bascule automatiquement
 * sur le moteur déterministe certifié ANSD.
 */
export async function generateGeminiStrategicAnalysis(
  input: GeminiEvaluationInput
): Promise<GeminiEvaluationOutput> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

  if (!apiKey) {
    return generateFallbackAnsdAnalysis(input, 'Moteur calibré ANSD (Clé GEMINI_API_KEY non configurée)');
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `Tu es l'analyste en chef et expert d'intelligence économique du fonds d'investissement TUNQ (Sénégal & UEMOA).
Ton rôle est de produire un diagnostic d'arbitrage impitoyable, précis, formel et basé sur les statistiques officielles du marché ouest-africain.
Les montants monétaires sont en FCFA (XOF). Tu dois strictement intégrer les données ANSD fournies.
Tu dois répondre UNIQUEMENT en JSON valide, sans texte additionnel, avec la structure suivante :
{
  "verdictRationale": "Synthèse d'arbitrage exécutif en 2-3 phrases percutantes",
  "recommendations": ["Recommandation prioritaire 1", "Recommandation prioritaire 2", "Recommandation prioritaire 3"],
  "swot": {
    "strengths": ["Force 1", "Force 2", "Force 3"],
    "weaknesses": ["Faiblesse 1", "Faiblesse 2", "Faiblesse 3"],
    "opportunities": ["Opportunité 1", "Opportunité 2"],
    "threats": ["Menace 1", "Menace 2"]
  },
  "pestel": {
    "political": "Contexte politique & vision Sénégal 2050",
    "economic": "Taux directeur BCEAO, inflation IHPC et pouvoir d'achat",
    "social": "Démographie RGPH-5 et structure des ménages",
    "tech": "Adoption mobile money, connectivité",
    "environmental": "Enjeux climatiques et saisonnalité",
    "legal": "Cadre SYSCOHADA et droit OHADA"
  },
  "executionPlan": {
    "days30": ["Action concrète 1", "Action concrète 2"],
    "days60": ["Action concrète 1", "Action concrète 2"],
    "days90": ["Action concrète 1", "Action concrète 2"]
  }
}`;

    const userPrompt = `Analyse ce projet d'entreprise avec rigueur :
PROJET:
- Nom: ${input.project.title}
- Secteur: ${input.project.sectorName} (Taux de survie à 3 ans selon RGE-2 ANSD: ${input.ansdContext.sectorSurvivalRate3yr}%)
- Cause n°1 de défaillance sectorielle ANSD: "${input.ansdContext.topFailureCause}"
- Région d'implantation: ${input.project.regionName} (Population: ${input.ansdContext.regionalPopulation.toLocaleString('fr-FR')} hab., ${input.ansdContext.regionalHouseholds.toLocaleString('fr-FR')} ménages)
- Description: ${input.project.description || 'Non précisée'}
- Cible Export UEMOA: ${input.project.isUemoaExportTarget ? `Oui (${input.project.uemoaTargetCountry || 'Sous-région'})` : 'Non'}

DONNÉES FINANCIÈRES PRÉVISIONNELLES:
- Prix unitaire: ${input.financials.unitPriceFcfa.toLocaleString('fr-FR')} FCFA
- Coût de revient unitaire: ${input.financials.unitCostFcfa.toLocaleString('fr-FR')} FCFA
- Marge brute: ${input.financials.grossMarginPct.toFixed(1)}%
- Charges fixes mensuelles: ${input.financials.monthlyFixedCostsFcfa.toLocaleString('fr-FR')} FCFA
- Volume visé mensuel: ${input.financials.targetMonthlySalesVolume} unités
- Seuil de rentabilité: ${input.financials.breakevenUnits} unités / mois (${input.financials.breakevenRevenueFcfa.toLocaleString('fr-FR')} FCFA)
- Fonds de roulement recommandé: ${input.financials.workingCapitalRecFcfa.toLocaleString('fr-FR')} FCFA
- Inflation nationale actuelle (IHPC ANSD): ${input.ansdContext.inflationRateYoY}%

Génère l'analyse d'arbitrage sous format JSON strict.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text || '';
    const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      verdictRationale: parsed.verdictRationale || 'Projet validé sous réserve de respect du seuil critique.',
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      swot: {
        strengths: parsed.swot?.strengths || [],
        weaknesses: parsed.swot?.weaknesses || [],
        opportunities: parsed.swot?.opportunities || [],
        threats: parsed.swot?.threats || [],
      },
      pestel: {
        political: parsed.pestel?.political || '',
        economic: parsed.pestel?.economic || '',
        social: parsed.pestel?.social || '',
        tech: parsed.pestel?.tech || '',
        environmental: parsed.pestel?.environmental || '',
        legal: parsed.pestel?.legal || '',
      },
      executionPlan: {
        days30: parsed.executionPlan?.days30 || [],
        days60: parsed.executionPlan?.days60 || [],
        days90: parsed.executionPlan?.days90 || [],
      },
      modelUsed: `Google Gemini (${modelName})`,
      generatedWithAi: true,
    };
  } catch (error) {
    console.error('[Gemini API Call Failed, falling back to calibrated ANSD]', error);
    return generateFallbackAnsdAnalysis(
      input,
      `Moteur calibré ANSD (Repli suite à erreur Gemini: ${error instanceof Error ? error.message : 'inconnu'})`
    );
  }
}

/**
 * Moteur de repli déterministe certifié ANSD
 */
function generateFallbackAnsdAnalysis(
  input: GeminiEvaluationInput,
  reason: string
): GeminiEvaluationOutput {
  const isHealthyMargin = input.financials.grossMarginPct >= 30;
  const coversBreakeven = input.financials.targetMonthlySalesVolume >= input.financials.breakevenUnits;

  const rationale = coversBreakeven && isHealthyMargin
    ? `Le projet présente une assise financière robuste avec une marge brute unitaire de ${input.financials.grossMarginPct.toFixed(1)}%. Le seuil d'équilibre de ${input.financials.breakevenUnits} unités est réaliste face aux ${input.ansdContext.regionalHouseholds.toLocaleString('fr-FR')} ménages recensés dans la région de ${input.project.regionName}.`
    : `Attention aux ratios d'exploitation : le seuil d'équilibre (${input.financials.breakevenUnits} unités/mois) est sous tension face au volume prévisionnel. La cause principale de mortalité dans ce secteur selon l'ANSD est "${input.ansdContext.topFailureCause}". Une dotation en fonds de roulement de sécurité d'au moins ${input.financials.workingCapitalRecFcfa.toLocaleString('fr-FR')} FCFA est impérative.`;

  return {
    verdictRationale: rationale,
    recommendations: [
      `Constituer immédiatement le fonds de roulement de sécurité de ${input.financials.workingCapitalRecFcfa.toLocaleString('fr-FR')} FCFA avant tout engagement d'investissement lourd.`,
      `Valider un pilote commercial sur les 30 premiers jours auprès des circuits de distribution locaux à ${input.project.regionName}.`,
      `Indexer les devis d'intrants sur l'IHPC officiel (inflation mesurée à ${input.ansdContext.inflationRateYoY}%) pour préserver la marge brute.`,
    ],
    swot: {
      strengths: [
        `Positionnement direct sur le pôle économique de ${input.project.regionName}.`,
        `Marge brute unitaire estimée à ${input.financials.grossMarginPct.toFixed(1)}% offrant une absorption des aléas.`,
        `Alignement sectoriel avec les besoins réels mesurés par le RGE-2 de l'ANSD.`,
      ],
      weaknesses: [
        `Charges fixes incompressibles de ${input.financials.monthlyFixedCostsFcfa.toLocaleString('fr-FR')} FCFA imposant un flux de trésorerie constant dès le premier mois.`,
        `Pression concurrentielle du secteur informel très présent (${input.project.sectorName}).`,
        `Vulnérabilité face aux délais de paiement clients (risque n°1 documenté par l'ANSD).`,
      ],
      opportunities: [
        `Potentiel d'expansion sur les corridors UEMOA (marché intégré de 142,5 millions de consommateurs).`,
        `Intégration des canaux de paiement digitaux (Wave, Orange Money) pour réduire les impayés.`,
        `Programmes nationaux de promotion de la souveraineté économique et du contenu local.`,
      ],
      threats: [
        `Pression inflationniste sur les intrants importés mesurée par l'IHPC (+${input.ansdContext.inflationRateYoY}% a/a).`,
        `Taux directeur BCEAO à 3,50% limitant l'accès au crédit bancaire classique à court terme.`,
        `Risque d'éviction par des produits de substitution à bas coût sur les marchés hebdomadaires.`,
      ],
    },
    pestel: {
      political: `Vision nationale "Sénégal 2050", priorité à la souveraineté industrielle et alimentaire locale.`,
      economic: `Taux directeur BCEAO à 3,50%, inflation contenue par l'ANSD (${input.ansdContext.inflationRateYoY}%), croissance projetée portée par l'énergie.`,
      social: `Démographie dynamique (60,4% de moins de 25 ans selon le RGPH-5), taille moyenne des ménages de 8,7 personnes.`,
      tech: `Taux de pénétration mobile supérieur à 115%, généralisation des paiements QR code et marchands.`,
      environmental: `Stress hydrique et saisonnalité des récoltes nécessitant des dispositifs de stockage adaptés.`,
      legal: `Cadre fiscal et comptable SYSCOHADA révisé, régime préférentiel des PME et droit des affaires OHADA.`,
    },
    executionPlan: {
      days30: [
        `Sécurisation des approvisionnements clés et contractualisation des devis fournisseurs aux prix négociés.`,
        `Enregistrement de l'entreprise au RCCM et ouverture du compte bancaire d'exploitation avec le BFR initial.`,
      ],
      days60: [
        `Lancement de la campagne de pré-commercialisation auprès des 20 premiers clients tests à ${input.project.regionName}.`,
        `Mise en place de l'outil de gestion de trésorerie pour surveiller l'atteinte du point mort hebdomadaire.`,
      ],
      days90: [
        `Audit des marges réelles obtenues par rapport au modèle initial (${input.financials.grossMarginPct.toFixed(1)}%).`,
        input.project.isUemoaExportTarget
          ? `Validation des conformités douanières UEMOA (certificat d'origine) pour les premières livraisons transfrontalières.`
          : `Stabilisation du volume commercial pour atteindre 100% du seuil de rentabilité mensuel.`,
      ],
    },
    modelUsed: reason,
    generatedWithAi: false,
  };
}
