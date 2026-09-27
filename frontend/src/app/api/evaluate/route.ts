import { NextRequest, NextResponse } from 'next/server';
import { ProjectInput, FullProjectEvaluation } from '@/types';
import { calculateFinancialViability } from '@/lib/financial-engine';
import { generateStrategicDiagnosis } from '@/lib/strategic-diagnosis';
import { evaluateWithJev } from '@/lib/jev-engine';
import { generateActionPlanWithGemini } from '@/lib/gemini-engine';

export async function POST(req: NextRequest) {
  try {
    const body: ProjectInput = await req.json();

    // 1. Validation
    if (!body.title || !body.sectorId || !body.regionId || !body.unitPriceFcfa) {
      return NextResponse.json(
        { error: 'Veuillez renseigner tous les champs obligatoires du projet.' },
        { status: 400 }
      );
    }

    // 2. Financial Profitability Analysis
    const financials = calculateFinancialViability(body);

    // 3. Strategic Diagnosis (SWOT, Porter, PESTEL, TAM/SAM/SOM)
    const diagnosis = generateStrategicDiagnosis(body);

    // 4. Jev System One Decision Arbitration
    const decision = await evaluateWithJev(body, financials, diagnosis);

    // 5. Gemini Strategic Action Plan
    const actionPlan = await generateActionPlanWithGemini(body, financials, diagnosis, decision);

    // 6. Turso Database Persistence
    const { saveProject, saveEvaluation } = await import('@/lib/turso/repository');
    const savedProject = await saveProject({
      title: body.title,
      sector_id: body.sectorId,
      region_id: body.regionId,
      description: body.description || '',
      is_uemoa_target: body.isUemoaExportTarget ? 1 : 0,
      uemoa_target_country: body.uemoaTargetCountry || null
    });

    const savedEvaluation = await saveEvaluation({
      project_id: savedProject.id,
      unit_price_fcfa: body.unitPriceFcfa,
      unit_cost_fcfa: body.unitCostFcfa,
      monthly_fixed_costs_fcfa: body.monthlyFixedCostsFcfa,
      target_monthly_sales_volume: body.targetMonthlySalesVolume,
      breakeven_units: financials.breakEvenMonthlyUnits,
      breakeven_revenue_fcfa: financials.breakEvenMonthlyRevenueFcfa,
      gross_margin_pct: financials.grossMarginPct,
      working_capital_rec_fcfa: financials.workingCapitalReserveFcfa,
      verdict: decision.verdict === 'GO' ? 'VIABLE_IMMÉDIAT' : decision.verdict === 'PIVOT' ? 'PIVOT_REQUIS' : 'NON_VIABLE',
      confidence_score: Math.round(decision.confidence * 100),
      gemini_analysis_json: JSON.stringify({
        actionPlan,
        scores: decision.scores,
        noulChecks: decision.noulChecks,
        rationale: decision.coreRationale
      })
    });

    const evaluation: FullProjectEvaluation = {
      id: savedEvaluation.id,
      createdAt: savedEvaluation.created_at,
      project: body,
      financials,
      diagnosis,
      decision,
      actionPlan
    };

    return NextResponse.json(evaluation);
  } catch (error: any) {
    console.error('Evaluation API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de l’évaluation décisionnelle.' },
      { status: 500 }
    );
  }
}
