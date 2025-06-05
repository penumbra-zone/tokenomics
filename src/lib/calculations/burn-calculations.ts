// Burn Metrics Calculations

import { BurnDataBySource } from "../db/pindexer/types";
import { formatDateForChart } from "../utils";
import { BurnData, BurnMetrics, CalculationContext } from "./types";

/**
 * Calculate total permanently burned tokens from all sources
 * Only includes: arbitrage burns and fee burns (permanently burned)
 * Excludes: auction and dex burns (locked but recoverable)
 * Formula: TotalBurned = ArbitrageBurns + FeeBurns
 */
export function calculateTotalBurned(totalArbitrageBurns: number, totalFeeBurns: number): number {
  return totalArbitrageBurns + totalFeeBurns;
}

/**
 * Calculate percentage of effective supply burned
 * Formula: %EffectiveSupplyBurned = CumulativeTotalBurned / (CurrentTotalSupply + CumulativeTotalBurned) × 100%
 */
export function calculatePercentageOfSupplyBurned(
  totalBurned: number,
  currentTotalSupply: number,
): number {
  const effectiveSupply = currentTotalSupply + totalBurned;
  if (effectiveSupply === 0) return 0;
  return (totalBurned / effectiveSupply) * 100;
}

/**
 * Calculate burn rate time series for charts
 */
export function calculateBurnRateTimeSeries(
  burnData: { arbitrageBurns: number; feeBurns: number; timestamp: Date }[],
): Array<{ timestamp: string; rate: number }> {
  // Calculate burn rate for each period
  const results: Array<{ timestamp: string; rate: number }> = [];

  for (const data of burnData) {
    const totalBurnedForDay = calculateTotalBurned(data.arbitrageBurns, data.feeBurns);

    results.push({
      timestamp: formatDateForChart(data.timestamp),
      rate: totalBurnedForDay,
    });
  }

  return results.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

/**
 * Calculate comprehensive burn metrics
 */
export function calculateBurnMetrics(
  burnsBySource: BurnDataBySource,
  currentTotalSupply: number,
  context: CalculationContext,
): BurnMetrics {
  const { blocksPerDay } = context.config;

  // Calculate total burned across all data (only permanent burns)
  const totalBurned = calculateTotalBurned(burnsBySource.arbitrageBurns, burnsBySource.feeBurns);

  // Calculate percentage of supply burned
  const percentageOfSupplyBurned = (
    totalBurned /
    (currentTotalSupply + totalBurned)
  ) * 100;

  // Calculate burn rate per day (using latest data point for rate calculation)
  const burnRatePerBlock = totalBurned / context.currentHeight;
  const burnRatePerDay = burnRatePerBlock * blocksPerDay;

  return {
    totalBurned,
    percentageOfSupplyBurned,
    burnRatePerDay,
    burnsBySource,
  };
}
