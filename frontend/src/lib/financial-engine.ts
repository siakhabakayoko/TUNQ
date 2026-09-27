/**
 * Financial Profitability & Stress-Testing Engine for TUNQ.
 * Models unit economics, break-even thresholds, working capital requirements,
 * and sensitivity shocks grounded in ANSD RGE benchmarks.
 */

import { ProjectInput, FinancialAnalysis } from '@/types';
import { getSectorById } from './ansd-service';

export function calculateFinancialViability(project: ProjectInput): FinancialAnalysis {
  const { unitPriceFcfa, unitCostFcfa, monthlyFixedCostsFcfa, targetMonthlySalesVolume, sectorId } = project;

  // Sector benchmarks from ANSD RGE-2
  const sectorBenchmark = getSectorById(sectorId);
  const benchmarkMarginPct = sectorBenchmark.avg_gross_margin_pct;

  // Unit Economics
  const unitMarginFcfa = Math.max(0, unitPriceFcfa - unitCostFcfa);
  const grossMarginPct = unitPriceFcfa > 0 ? (unitMarginFcfa / unitPriceFcfa) * 100 : 0;

  // Break-even Analysis (Point Mort)
  const breakEvenMonthlyUnits = unitMarginFcfa > 0 ? Math.ceil(monthlyFixedCostsFcfa / unitMarginFcfa) : 999999;
  const breakEvenMonthlyRevenueFcfa = breakEvenMonthlyUnits * unitPriceFcfa;

  // Monthly Net Profit at Target Volume
  const monthlyRevenueFcfa = targetMonthlySalesVolume * unitPriceFcfa;
  const monthlyVariableCostsFcfa = targetMonthlySalesVolume * unitCostFcfa;
  const estimatedMonthlyNetProfitFcfa = monthlyRevenueFcfa - (monthlyVariableCostsFcfa + monthlyFixedCostsFcfa);
  const annualTurnoverFcfa = monthlyRevenueFcfa * 12;

  // Months to reach break-even trajectory (assuming ramp-up)
  let monthsToBreakEven = 6;
  if (targetMonthlySalesVolume >= breakEvenMonthlyUnits * 2) {
    monthsToBreakEven = 3;
  } else if (targetMonthlySalesVolume < breakEvenMonthlyUnits) {
    monthsToBreakEven = 14; // Deficit warning
  } else {
    monthsToBreakEven = 7;
  }

  // Margin variance vs Sector benchmark
  const marginVariancePct = grossMarginPct - benchmarkMarginPct;

  // Recommended Working Capital Reserve (BFR) for Senegal market
  // In Senegal, payment delays and seasonal lulls require minimum 4 months of fixed costs + 1 month inventory
  const workingCapitalReserveFcfa = Math.round(monthlyFixedCostsFcfa * 4.5 + monthlyVariableCostsFcfa * 1.2);

  // Stress-Test 1: Inflation Shock (+15% input costs, tracking IPPI industrial price volatility)
  const shockUnitCost = unitCostFcfa * 1.15;
  const shockUnitMargin = unitPriceFcfa - shockUnitCost;
  const newGrossMarginPct = unitPriceFcfa > 0 ? (shockUnitMargin / unitPriceFcfa) * 100 : 0;
  const shockMonthlyProfit = targetMonthlySalesVolume * unitPriceFcfa - (targetMonthlySalesVolume * shockUnitCost + monthlyFixedCostsFcfa);
  const isStillProfitable = shockMonthlyProfit > 0;

  // Stress-Test 2: Commercial Delay Shock (90 days sales lag)
  // Cash needed to survive 3 months without revenues
  const requiredCashRunwayFcfa = monthlyFixedCostsFcfa * 3;

  return {
    unitMarginFcfa,
    grossMarginPct: Number(grossMarginPct.toFixed(1)),
    breakEvenMonthlyUnits,
    breakEvenMonthlyRevenueFcfa,
    estimatedMonthlyNetProfitFcfa,
    annualTurnoverFcfa,
    monthsToBreakEven,
    sectorBenchmarkMarginPct: Number(benchmarkMarginPct.toFixed(1)),
    marginVariancePct: Number(marginVariancePct.toFixed(1)),
    workingCapitalReserveFcfa,
    stressTestInflation: {
      shockCostIncreasePct: 15,
      newGrossMarginPct: Number(newGrossMarginPct.toFixed(1)),
      isStillProfitable
    },
    stressTestDelay: {
      delayedMonths: 3,
      requiredCashRunwayFcfa
    }
  };
}
