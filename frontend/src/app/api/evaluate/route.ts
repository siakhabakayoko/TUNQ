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

    const evaluation: FullProjectEvaluation = {
      id: `eval_${Date.now()}`,
      createdAt: new Date().toISOString(),
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
