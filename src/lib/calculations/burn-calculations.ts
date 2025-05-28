// Burn Metrics Calculations
// Based on the tokenomics calculation documentation

import { BurnData, BurnMetrics, CalculationContext } from "./types";

/**
 * Calculate total permanently burned tokens from all sources
 * Only includes: arbitrage burns and fee burns (permanently burned)
 * Excludes: auction and dex burns (locked but recoverable)
 * Formula: TotalBurned = ArbitrageBurns + FeeBurns
 */
export function calculateTotalBurned(
  totalArbitrageBurns: number,
  totalFeeBurns: number
): number {
  return totalArbitrageBurns + totalFeeBurns;
}

/**
 * Calculate total burned for a single entry
 */
export function calculateTotalBurnedForEntry(burnData: BurnData): number {
  return burnData.arbitrageBurns + burnData.feeBurns;
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
export function calculateBurnRatePerBlock(totalBurned: number, blockHeight: string): number {
  if (Number(blockHeight) === 0) return 0;
  return totalBurned / Number(blockHeight);
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
  burnData: BurnData[]
): Array<{ date: string; burnRate: number }> {
  // Calculate burn rate for each period
  const results: Array<{ date: string; burnRate: number }> = [];

  for (const data of burnData) {
    const totalBurnedForDay = calculateTotalBurnedForEntry(data);
    // Convert to daily rate (assuming the data represents the total for that day)
    const burnRate = totalBurnedForDay;

    results.push({
      date: data.timestamp.toISOString().slice(0, 10),
      burnRate,
    });
  }

  return results.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate comprehensive burn metrics
 */
export function calculateBurnMetrics(
  burnData: BurnData[],
  currentTotalSupply: number,
  context: CalculationContext
): BurnMetrics {
  const { blocksPerDay } = context.config;

  // Calculate total burned across all data (only permanent burns)
  const totalBurned = calculateTotalBurned(
    burnData[burnData.length - 1].arbitrageBurns,
    burnData[burnData.length - 1].feeBurns
  );

  // Calculate percentage of supply burned
  const percentageOfSupplyBurned = calculatePercentageOfSupplyBurned(
    totalBurned,
    currentTotalSupply
  );

  // Calculate burn rate per day (using latest data point for rate calculation)
  const latestBurnData = burnData[burnData.length - 1];
  const burnRatePerBlock = latestBurnData
    ? calculateBurnRatePerBlock(calculateTotalBurnedForEntry(latestBurnData), latestBurnData.height)
    : 0;
  const burnRatePerDay = calculateBurnRatePerDay(burnRatePerBlock, blocksPerDay);

  // Calculate burns by source
  const burnsBySource = calculateBurnsBySource(burnData);

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
