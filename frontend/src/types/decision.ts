import type { SectorId, RegionId } from '@/types';
import type { StrategicSwot, StrategicPestel } from '@/lib/gemini/types';

export type VerdictStatus =
  | 'VIABLE_IMMÉDIAT'
  | 'VIABLE_SOUS_CONDITIONS'
  | 'NON_VIABLE'
  | 'PIVOT_REQUIS';

export interface ProjectFormInputs {
  title: string;
  tagline?: string;
  sectorId: SectorId | string;
  regionId: RegionId | string;
  description?: string;
  unitPriceFcfa: number;
  unitCostFcfa: number;
  monthlyFixedCostsFcfa: number;
  targetMonthlySalesVolume: number;
  isUemoaExportTarget?: boolean;
  uemoaTargetCountry?: string;
  fundingNeededFcfa?: number;
}

export interface EvaluationResult {
  project: ProjectFormInputs;
  evaluatedAt: string;
  verdict: VerdictStatus;
  confidenceScore: number;
  verdictRationale: string;
  metrics: {
    breakevenVolumeUnits: number;
    breakevenRevenueFcfa: number;
    grossMarginPct: number;
    estimatedPaybackMonths: number;
    workingCapitalRequirementFcfa: number;
    survivalProbability3Yr: number;
  };
  ansdBenchmark: {
    sectorSurvivalRate3yr: number;
    sectorAverageGrossMarginPct: number;
    sectorTopFailureCause: string;
    regionalPurchasingPower: string;
    regionalPopulation: number;
    regionalHouseholds: number;
    subregionalGrowthTrend: string;
  };
  marketSizing: {
    tamMillionsFcfa: number;
    samMillionsFcfa: number;
    somYear1MillionsFcfa: number;
    methodologyDescription: string;
  };
  stressTest: {
    inflationShockTestedPct: number;
    marginAfterShockPct: number;
    isResilient: boolean;
    workingCapitalBufferNeededFcfa: number;
  };
  strategicAnalysis: {
    swot: StrategicSwot;
    pestel: StrategicPestel;
    recommendations: string[];
    executionRoadmap: {
      days30: string[];
      days60: string[];
      days90: string[];
    };
  };
}
