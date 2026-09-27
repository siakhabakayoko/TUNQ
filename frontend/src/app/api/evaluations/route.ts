import { NextResponse } from 'next/server';
import { saveProject, saveEvaluation, getRecentEvaluations } from '@/lib/turso/repository';
import { generateGeminiStrategicAnalysis } from '@/lib/gemini/client';
import type { ProjectFormInputs, EvaluationResult, VerdictStatus } from '@/types/decision';

// Données de référence ANSD statiques pour calculs immédiats
import rgeData from '@/data/ansd/rge_entreprises.json';
import rgph5Data from '@/data/ansd/rgph5_demographie.json';
import ihpcData from '@/data/ansd/ihpc_senegal.json';
import uemoaData from '@/data/ansd/uemoa_regional.json';

/**
 * GET /api/evaluations
 * Récupère l'historique des évaluations enregistrées dans Turso.
 */
export async function GET() {
  try {
    const list = await getRecentEvaluations(15);
    return NextResponse.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    console.error('[API GET /api/evaluations Error]', error);
    return NextResponse.json(
      { success: false, error: 'Impossible de récupérer les évaluations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/evaluations
 * Calcule les indicateurs financiers, génère l'analyse IA via Gemini, et persiste dans Turso.
 */
export async function POST(request: Request) {
  try {
    const body: ProjectFormInputs = await request.json();

    // Validation stricte des entrées
    if (!body.title || !body.sectorId || !body.regionId) {
      return NextResponse.json(
        { success: false, error: 'Champs obligatoires manquants (title, sectorId, regionId)' },
        { status: 400 }
      );
    }

    if (body.unitPriceFcfa <= 0 || body.monthlyFixedCostsFcfa <= 0 || body.targetMonthlySalesVolume <= 0) {
      return NextResponse.json(
        { success: false, error: 'Les valeurs financières doivent être strictement positives.' },
        { status: 400 }
      );
    }

    // 1. Calcul financier déterministe
    const unitMargin = body.unitPriceFcfa - body.unitCostFcfa;
    const grossMarginPct = body.unitPriceFcfa > 0 ? (unitMargin / body.unitPriceFcfa) * 100 : 0;
    
    // Seuil de rentabilité (Point mort)
    const breakevenUnits = unitMargin > 0 ? Math.ceil(body.monthlyFixedCostsFcfa / unitMargin) : 999999;
    const breakevenRevenue = breakevenUnits * body.unitPriceFcfa;
    const workingCapitalRec = body.monthlyFixedCostsFcfa * 6; // 6 mois de charges fixes de sécurité

    // Recherche des métadonnées ANSD
    const sector = rgeData.sectors.find((s) => s.sector_id === body.sectorId) || rgeData.sectors[0];
    const region = rgph5Data.regions.find((r) => r.region_id === body.regionId) || rgph5Data.regions[0];
    const latestInflation = ihpcData.monthly_series[ihpcData.monthly_series.length - 1]?.inflation_rate_yoy || 3.5;

    // Calcul de l'arbitrage et du verdict
    let verdict: VerdictStatus = 'VIABLE_IMMÉDIAT';
    let confidenceScore = 85;

    if (unitMargin <= 0) {
      verdict = 'NON_VIABLE';
      confidenceScore = 95;
    } else if (breakevenUnits > body.targetMonthlySalesVolume * 1.5) {
      verdict = 'NON_VIABLE';
      confidenceScore = 88;
    } else if (breakevenUnits > body.targetMonthlySalesVolume) {
      verdict = 'PIVOT_REQUIS';
      confidenceScore = 78;
    } else if (grossMarginPct < 25 || sector.survival_rate_3yr < 45) {
      verdict = 'VIABLE_SOUS_CONDITIONS';
      confidenceScore = 74;
    }

    // Calcul TAM / SAM / SOM
    const regionalHouseholds = region.households || 100000;
    const totalSenegalPop = rgph5Data.metadata.total_population;
    const annualSpendingPerCapitaFcfa = (region.avg_monthly_income_fcfa * 12) / 8.7;
    const tamBillions = Number(((totalSenegalPop * annualSpendingPerCapitaFcfa * 0.15) / 1000000).toFixed(1));
    const samBillions = Number(((region.population * annualSpendingPerCapitaFcfa * 0.15) / 1000000).toFixed(1));
    const somBillions = Number((samBillions * 0.025).toFixed(1));

    // 2. Appel à Google Gemini pour la synthèse cognitive
    const geminiAnalysis = await generateGeminiStrategicAnalysis({
      project: {
        title: body.title,
        sectorId: sector.sector_id,
        sectorName: sector.name,
        regionId: region.region_id,
        regionName: region.name,
        description: body.description,
        isUemoaExportTarget: body.isUemoaExportTarget,
        uemoaTargetCountry: body.uemoaTargetCountry,
      },
      financials: {
        unitPriceFcfa: body.unitPriceFcfa,
        unitCostFcfa: body.unitCostFcfa,
        monthlyFixedCostsFcfa: body.monthlyFixedCostsFcfa,
        targetMonthlySalesVolume: body.targetMonthlySalesVolume,
        breakevenUnits,
        breakevenRevenueFcfa: breakevenRevenue,
        grossMarginPct,
        workingCapitalRecFcfa: workingCapitalRec,
      },
      ansdContext: {
        sectorSurvivalRate3yr: sector.survival_rate_3yr,
        topFailureCause: sector.top_failure_cause,
        regionalPopulation: region.population,
        regionalHouseholds,
        inflationRateYoY: latestInflation,
        uemoaPopulation: uemoaData.metadata.total_uemoa_population,
      },
    });

    // 3. Persistance dans Turso (LibSQL)
    const savedProj = await saveProject({
      title: body.title,
      sector_id: sector.sector_id,
      region_id: region.region_id,
      description: body.description,
      is_uemoa_target: body.isUemoaExportTarget ? 1 : 0,
      uemoa_target_country: body.uemoaTargetCountry || null,
    });

    const savedEval = await saveEvaluation({
      project_id: savedProj.id,
      unit_price_fcfa: body.unitPriceFcfa,
      unit_cost_fcfa: body.unitCostFcfa,
      monthly_fixed_costs_fcfa: body.monthlyFixedCostsFcfa,
      target_monthly_sales_volume: body.targetMonthlySalesVolume,
      breakeven_units: breakevenUnits,
      breakeven_revenue_fcfa: breakevenRevenue,
      gross_margin_pct: grossMarginPct,
      working_capital_rec_fcfa: workingCapitalRec,
      verdict,
      confidence_score: confidenceScore,
      gemini_analysis_json: JSON.stringify(geminiAnalysis),
    });

    // 4. Construction de l'objet résultat
    const result: EvaluationResult = {
      project: body,
      evaluatedAt: savedEval.created_at,
      verdict,
      confidenceScore,
      verdictRationale: geminiAnalysis.verdictRationale,
      metrics: {
        breakevenVolumeUnits: breakevenUnits,
        breakevenRevenueFcfa: breakevenRevenue,
        grossMarginPct,
        estimatedPaybackMonths: Math.max(3, Math.min(24, Math.round((workingCapitalRec / (unitMargin * body.targetMonthlySalesVolume - body.monthlyFixedCostsFcfa || 1))))),
        workingCapitalRequirementFcfa: workingCapitalRec,
        survivalProbability3Yr: sector.survival_rate_3yr,
      },
      ansdBenchmark: {
        sectorSurvivalRate3yr: sector.survival_rate_3yr,
        sectorAverageGrossMarginPct: sector.avg_gross_margin_pct,
        sectorTopFailureCause: sector.top_failure_cause,
        regionalPurchasingPower: region.purchasing_tier,
        regionalPopulation: region.population,
        regionalHouseholds,
        subregionalGrowthTrend: sector.growth_trend,
      },
      marketSizing: {
        tamMillionsFcfa: tamBillions,
        samMillionsFcfa: samBillions,
        somYear1MillionsFcfa: somBillions,
        methodologyDescription: `Calculé d'après le recensement RGPH-5 (${region.name} : ${region.population.toLocaleString('fr-FR')} habitants, ${regionalHouseholds.toLocaleString('fr-FR')} ménages). Inclut l'expansion UEMOA (142,5 millions d'habitants).`,
      },
      stressTest: {
        inflationShockTestedPct: 15,
        marginAfterShockPct: Number((grossMarginPct * 0.9).toFixed(1)),
        isResilient: grossMarginPct * 0.9 >= 20,
        workingCapitalBufferNeededFcfa: body.monthlyFixedCostsFcfa * 3,
      },
      strategicAnalysis: {
        swot: geminiAnalysis.swot,
        pestel: geminiAnalysis.pestel,
        recommendations: geminiAnalysis.recommendations,
        executionRoadmap: {
          days30: geminiAnalysis.executionPlan.days30,
          days60: geminiAnalysis.executionPlan.days60,
          days90: geminiAnalysis.executionPlan.days90,
        },
      },
    };

    return NextResponse.json({
      success: true,
      evaluationId: savedEval.id,
      projectId: savedProj.id,
      modelUsed: geminiAnalysis.modelUsed,
      generatedWithAi: geminiAnalysis.generatedWithAi,
      result,
    });
  } catch (error) {
    console.error('[API POST /api/evaluations Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur interne du serveur lors de l\'évaluation',
      },
      { status: 500 }
    );
  }
}
