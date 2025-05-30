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
  currentTotalSupply: number
): number {
  const effectiveSupply = currentTotalSupply + totalBurned;
  if (effectiveSupply === 0) return 0;
  return (totalBurned / effectiveSupply) * 100;
}

/**
 * Calculate burn rate per block
 * Formula: BurnRate = TotalBurned / BlockHeight
 */
export function calculateBurnRatePerBlock(totalBurned: number, blockHeight: number): number {
  if (blockHeight === 0) return 0;
  return totalBurned / blockHeight;
}

/**
 * Calculate burn rate per day
 * Formula: DailyBurnRate = BurnRatePerBlock × BlocksPerDay
 */
export function calculateBurnRatePerDay(burnRatePerBlock: number, blocksPerDay: number): number {
  return burnRatePerBlock * blocksPerDay;
}

/**
 * Calculate burns by source for a period
 */
export function calculateBurnsBySource(burnData: BurnData[]): {
  arbitrageBurns: number;
  feeBurns: number;
} {
  return burnData.reduce(
    (totals, data) => ({
      arbitrageBurns: totals.arbitrageBurns + data.arbitrageBurns,
      feeBurns: totals.feeBurns + data.feeBurns,
    }),
    {
      arbitrageBurns: 0,
      feeBurns: 0,
    }
  );
}

/**
 * Calculate burn rate time series for charts
 */
export function calculateBurnRateTimeSeries(
  burnData: { arbitrageBurns: number; feeBurns: number; timestamp: Date }[]
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
  context: CalculationContext
): BurnMetrics {
  const { blocksPerDay } = context.config;

  // Calculate total burned across all data (only permanent burns)
  const totalBurned = calculateTotalBurned(burnsBySource.arbitrageBurns, burnsBySource.feeBurns);

  // Calculate percentage of supply burned
  const percentageOfSupplyBurned = calculatePercentageOfSupplyBurned(
    totalBurned,
    currentTotalSupply
  );

  // Calculate burn rate per day (using latest data point for rate calculation)
  const burnRatePerBlock = calculateBurnRatePerBlock(totalBurned, context.currentHeight);
  const burnRatePerDay = calculateBurnRatePerDay(burnRatePerBlock, blocksPerDay);

  return {
    totalBurned,
    percentageOfSupplyBurned,
    burnRatePerDay,
    burnsBySource,
  };
}

/**
 * Calculate burn source percentages for pie charts
 */
export function calculateBurnSourcePercentages(burnsBySource: {
  arbitrageBurns: number;
  feeBurns: number;
}): {
  arbitrageBurns: number;
  feeBurns: number;
} {
  const total = burnsBySource.arbitrageBurns + burnsBySource.feeBurns;

  if (total === 0) {
    return {
      arbitrageBurns: 0,
      feeBurns: 0,
    };
  }

  return {
    arbitrageBurns: (burnsBySource.arbitrageBurns / total) * 100,
    feeBurns: (burnsBySource.feeBurns / total) * 100,
  };
}
