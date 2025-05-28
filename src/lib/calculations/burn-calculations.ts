// Burn Metrics Calculations
// Based on the tokenomics calculation documentation

import { BurnData, BurnMetrics, CalculationContext } from "./types";

/**
 * Calculate total burned tokens from all sources
 * Formula: TotalBurned = Σ(DEXBurns + AuctionBurns + DexArbitrageBurns + TransactionFeesBurned)
 */
export function calculateTotalBurned(
  totalArbitrageBurns: number,
  totalFeeBurns: number,
  totalAuctionBurns: number,
  totalDexBurns: number
): number {
  return totalArbitrageBurns + totalFeeBurns + totalAuctionBurns + totalDexBurns;
}

/**
 * Calculate total burned for a single entry
 */
export function calculateTotalBurnedForEntry(burnData: BurnData): number {
  return burnData.fees + burnData.dexArb + burnData.auctionBurns + burnData.dexBurns;
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
  transactionFees: number;
  dexArbitrage: number;
  auctionBurns: number;
  dexBurns: number;
} {
  return burnData.reduce(
    (totals, data) => ({
      transactionFees: totals.transactionFees + data.fees,
      dexArbitrage: totals.dexArbitrage + data.dexArb,
      auctionBurns: totals.auctionBurns + data.auctionBurns,
      dexBurns: totals.dexBurns + data.dexBurns,
    }),
    {
      transactionFees: 0,
      dexArbitrage: 0,
      auctionBurns: 0,
      dexBurns: 0,
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

  // Calculate total burned across all data
  const totalBurned = calculateTotalBurned(
    burnData[burnData.length - 1].fees,
    burnData[burnData.length - 1].dexArb,
    burnData[burnData.length - 1].auctionBurns,
    burnData[burnData.length - 1].dexBurns
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
  transactionFees: number;
  dexArbitrage: number;
  auctionBurns: number;
  dexBurns: number;
}): {
  transactionFees: number;
  dexArbitrage: number;
  auctionBurns: number;
  dexBurns: number;
} {
  const total =
    burnsBySource.transactionFees +
    burnsBySource.dexArbitrage +
    burnsBySource.auctionBurns +
    burnsBySource.dexBurns;

  if (total === 0) {
    return {
      transactionFees: 0,
      dexArbitrage: 0,
      auctionBurns: 0,
      dexBurns: 0,
    };
  }

  return {
    transactionFees: (burnsBySource.transactionFees / total) * 100,
    dexArbitrage: (burnsBySource.dexArbitrage / total) * 100,
    auctionBurns: (burnsBySource.auctionBurns / total) * 100,
    dexBurns: (burnsBySource.dexBurns / total) * 100,
  };
}
