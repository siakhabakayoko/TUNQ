/**
 * Core TypeScript definitions for TUNQ - Strategic Economic Intelligence & Decision Platform.
 * All interfaces adhere strictly to project specifications.
 */

export type SectorId =
  | 'TECH_DIGITAL'
  | 'AGRO_INDUSTRY'
  | 'COMMERCE_RETAIL'
  | 'BTP_REALESTATE'
  | 'TRANSPORT_LOGISTICS'
  | 'HEALTH_PHARMA'
  | 'HOSPITALITY_FOOD'
  | 'EDUCATION_TRAINING';

export type RegionId =
  | 'DK' | 'TH' | 'DB' | 'SL' | 'KL' | 'ZG' | 'TC'
  | 'LG' | 'FT' | 'KD' | 'MT' | 'KF' | 'SD' | 'KG';

export type CountryCode = 'SN' | 'CI' | 'ML' | 'BF' | 'GN';

export type JevVerdict = 'GO' | 'PIVOT' | 'NO_GO';

export interface ProjectInput {
  title: string;
  tagline: string;
  sectorId: SectorId;
  regionId: RegionId;
  description: string;
  unitPriceFcfa: number;
  unitCostFcfa: number;
  monthlyFixedCostsFcfa: number;
  targetMonthlySalesVolume: number;
  isUemoaExportTarget: boolean;
  uemoaTargetCountry?: CountryCode;
  fundingNeededFcfa?: number;
}

export interface FinancialAnalysis {
  unitMarginFcfa: number;
  grossMarginPct: number;
  breakEvenMonthlyUnits: number;
  breakEvenMonthlyRevenueFcfa: number;
  estimatedMonthlyNetProfitFcfa: number;
  annualTurnoverFcfa: number;
  monthsToBreakEven: number;
  sectorBenchmarkMarginPct: number;
  marginVariancePct: number;
  workingCapitalReserveFcfa: number;
  stressTestInflation: {
    shockCostIncreasePct: number;
    newGrossMarginPct: number;
    isStillProfitable: boolean;
  };
  stressTestDelay: {
    delayedMonths: number;
    requiredCashRunwayFcfa: number;
  };
}

export interface StrategicDiagnosis {
  tamSamSom: {
    targetPopulation: number;
    tamFcfa: number;
    samFcfa: number;
    somFcfa: number;
    explanation: string;
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  porter5Forces: {
    threatNewEntrants: { score: number; label: string; details: string };
    bargainingPowerBuyers: { score: number; label: string; details: string };
    bargainingPowerSuppliers: { score: number; label: string; details: string };
    threatSubstitutes: { score: number; label: string; details: string };
    competitiveRivalry: { score: number; label: string; details: string };
  };
  pestelSenegal: {
    political: string;
    economic: string;
    social: string;
    technological: string;
    environmental: string;
    legal: string;
  };
}

export interface JevScores {
  profitabilityScore: number;       // 1 - 10
  marketAttractivenessScore: number; // 1 - 10
  supplyChainRiskScore: number;     // 1 - 10 (10 = very safe, 1 = severe risk)
  sectorSurvivalScore: number;      // 1 - 10 (based on RGE-2 survival at 3 yrs)
  uemoaExportScore: number;         // 1 - 10
}

export interface JevDecision {
  verdict: JevVerdict;
  confidence: number; // e.g. 0.942
  executionLatencyMs: number;
  scores: JevScores;
  noulChecks: {
    unitEconomicsViable: boolean;
    localPurchasingPowerFit: boolean;
    cashRunwaySufficient: boolean;
    uemoaCrossborderViable: boolean;
  };
  coreRationale: string;
}

export interface GeminiActionPlan {
  executiveSummary: string;
  phase30Days: {
    title: string;
    focus: string;
    milestones: string[];
  };
  phase60Days: {
    title: string;
    focus: string;
    milestones: string[];
  };
  phase90Days: {
    title: string;
    focus: string;
    milestones: string[];
  };
  institutionalCitations: {
    institution: string;
    sourceDocument: string;
    keyMetric: string;
    domain: string;
  }[];
}

export interface FullProjectEvaluation {
  id: string;
  createdAt: string;
  project: ProjectInput;
  financials: FinancialAnalysis;
  diagnosis: StrategicDiagnosis;
  decision: JevDecision;
  actionPlan: GeminiActionPlan;
}

export interface DataRoomFile {
  id: string;
  name: string;
  type: 'financial_syscohada' | 'survey_field' | 'supplier_quote' | 'business_plan' | 'legal';
  sizeBytes: number;
  syncSource: 'upload' | 'gdrive' | 'gmail';
  uploadedAt: string;
  status: 'indexed' | 'analyzed' | 'pending';
}

export interface WorkspaceOrg {
  id: string;
  name: string;
  slug: string;
  plan: 'enterprise_foundry' | 'growth' | 'starter';
  projectsCount: number;
  dataRoomFilesCount: number;
}
