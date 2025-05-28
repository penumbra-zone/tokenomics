// Issuance Metrics Calculations
// Based on the tokenomics calculation documentation

import { CalculationContext, IssuanceMetrics, SupplyData, TimePeriod } from "./types";

/**
 * Calculate daily gross issuance rate from block parameters
 * Formula: DailyGrossIssuance = IssuancePerBlock × BlocksInLast24Hours
 */
export function calculateDailyGrossIssuance(
  issuancePerBlock: number,
  blocksPerDay: number
): number {
  return issuancePerBlock * blocksPerDay;
}

/**
 * Calculate daily net issuance from supply changes
 * Formula: DailyNetIssuance = TotalSupply_now - TotalSupply_24h_ago
 */
export function calculateDailyNetIssuance(
  currentTotalSupply: number,
  totalSupply24hAgo: number
): number {
  return currentTotalSupply - totalSupply24hAgo;
}

/**
 * Calculate projected annual issuance
 * Formula: ProjectedAnnualIssuance = IssuancePerBlock × blocksPerDay × daysPerYear
 */
export function calculateProjectedAnnualIssuance(
  context: CalculationContext,
  issuancePerBlock: number
): number {
  return context.config.blocksPerDay * issuancePerBlock * 365;
}

/**
 * Calculate inflation rate for a specific period
 * Formula: InflationRate = (TotalSupply_now - TotalSupply_period_ago) / TotalSupply_period_ago × 100%
 */
export function calculateInflationRate(
  currentTotalSupply: number,
  pastTotalSupply: number
): number {
  if (pastTotalSupply === 0) return 0;
  return ((currentTotalSupply - pastTotalSupply) / pastTotalSupply) * 100;
}

/**
 * Calculate annualized inflation rate from a shorter period
 * Formula: AnnualInflationRate = windowInflation × (365 / windowDays)
 */
export function calculateAnnualizedInflationRate(
  windowInflationRate: number,
  windowDays: number
): number {
  return windowInflationRate * (365 / windowDays);
}

/**
 * Calculate inflation rate for the last month
 * Formula: InflationRate_last_month = (TotalSupply_now - TotalSupply_1_month_ago) / TotalSupply_1_month_ago × 100%
 */
export function calculateMonthlyInflationRate(
  currentSupplyData: SupplyData,
  monthAgoSupplyData: SupplyData
): number {
  return calculateInflationRate(currentSupplyData.total, monthAgoSupplyData.total);
}

/**
 * Calculate inflation rate for sub-periods (for charts)
 * Formula: InflationRate_subPeriod = (TotalSupply_t - TotalSupply_t-1) / TotalSupply_t-1 × 100%
 */
export function calculateSubPeriodInflationRates(
  supplyDataPoints: SupplyData[]
): Array<{ timestamp: Date; inflationRate: number }> {
  const results: Array<{ timestamp: Date; inflationRate: number }> = [];

  for (let i = 1; i < supplyDataPoints.length; i++) {
    const current = supplyDataPoints[i];
    const previous = supplyDataPoints[i - 1];

    const inflationRate = calculateInflationRate(current.total, previous.total);

    results.push({
      timestamp: current.timestamp,
      inflationRate,
    });
  }

  return results;
}

/**
 * Calculate comprehensive issuance metrics
 */
export function calculateIssuanceMetrics(context: CalculationContext): IssuanceMetrics {
  const currentIssuance = context.config.stakingIssuancePerBlock ?? 0;
  const annualIssuance = calculateProjectedAnnualIssuance(context, currentIssuance);
  return { currentIssuance, projectedAnnualIssuance: annualIssuance };
}

/**
 * Get time period in days
 */
export function getTimePeriodDays(period: TimePeriod): number {
  switch (period) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "1y":
      return 365;
    default:
      return 30;
  }
}

/**
 * Calculate inflation rate time series for charts
 */
export function calculateInflationTimeSeries(
  supplyDataPoints: SupplyData[],
  period: TimePeriod
): Array<{ date: string; inflationRate: number }> {
  const periodDays = getTimePeriodDays(period);
  const subPeriodRates = calculateSubPeriodInflationRates(supplyDataPoints);

  return subPeriodRates.map((point) => ({
    date: point.timestamp.toISOString().slice(0, 10),
    inflationRate: calculateAnnualizedInflationRate(point.inflationRate, 1), // Annualize daily rate
  }));
}
