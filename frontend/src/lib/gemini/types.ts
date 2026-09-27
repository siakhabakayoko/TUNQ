/**
 * Types pour le module d'intelligence stratégique Google Gemini
 */

export interface GeminiEvaluationInput {
  project: {
    title: string;
    sectorId: string;
    sectorName: string;
    regionId: string;
    regionName: string;
    description: string;
    isUemoaExportTarget: boolean;
    uemoaTargetCountry?: string;
  };
  financials: {
    unitPriceFcfa: number;
    unitCostFcfa: number;
    monthlyFixedCostsFcfa: number;
    targetMonthlySalesVolume: number;
    breakevenUnits: number;
    breakevenRevenueFcfa: number;
    grossMarginPct: number;
    workingCapitalRecFcfa: number;
  };
  ansdContext: {
    sectorSurvivalRate3yr: number;
    topFailureCause: string;
    regionalPopulation: number;
    regionalHouseholds: number;
    inflationRateYoY: number;
    uemoaPopulation?: number;
  };
}

export interface StrategicSwot {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface StrategicPestel {
  political: string;
  economic: string;
  social: string;
  tech: string;
  environmental: string;
  legal: string;
}

export interface StrategicExecutionPlan {
  days30: string[];
  days60: string[];
  days90: string[];
}

export interface GeminiEvaluationOutput {
  verdictRationale: string;
  recommendations: string[];
  swot: StrategicSwot;
  pestel: StrategicPestel;
  executionPlan: StrategicExecutionPlan;
  modelUsed: string;
  generatedWithAi: boolean;
}
