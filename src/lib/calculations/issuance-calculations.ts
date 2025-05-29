// Issuance Metrics Calculations

import { CalculationContext, IssuanceMetrics, SupplyData } from "./types";

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
): Array<{ timestamp: Date; inflationRate: number; absoluteAmount: number }> {
  const results: Array<{ timestamp: Date; inflationRate: number; absoluteAmount: number }> = [];

  for (let i = 1; i < supplyDataPoints.length; i++) {
    const current = supplyDataPoints[i];
    const previous = supplyDataPoints[i - 1];

    const inflationRate = calculateInflationRate(current.total, previous.total);
    const absoluteAmount = current.total - previous.total; // Absolute change in supply

    results.push({
      timestamp: current.timestamp,
      inflationRate,
      absoluteAmount,
    });
  }
  console.log("First supply and last supply", supplyDataPoints[0].total, supplyDataPoints[supplyDataPoints.length - 1].total);
  console.log("Difference", supplyDataPoints[supplyDataPoints.length - 1].total - supplyDataPoints[0].total);
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
 * Calculate inflation rate time series for charts
 */
export function calculateInflationTimeSeries(
  supplyDataPoints: SupplyData[],
): Array<{ date: string; inflationRate: number; absoluteAmount: number }> {
  const subPeriodRates = calculateSubPeriodInflationRates(supplyDataPoints);

  return subPeriodRates.map((point) => ({
    date: point.timestamp.toISOString().slice(0, 10),
    inflationRate: calculateAnnualizedInflationRate(point.inflationRate, 1), // Annualize daily rate
    absoluteAmount: point.absoluteAmount, // Keep absolute amount as-is (actual UM change)
  }));
}
