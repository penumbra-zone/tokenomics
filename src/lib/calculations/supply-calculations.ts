// Supply Visualization Calculations

import { CalculationContext, SupplyData, SupplyMetrics } from "./types";

/**
 * Calculate market cap from total supply and current price
 * Formula: MarketCap = CurrentTotalSupply × CurrentPriceInUSDC
 */
export function calculateMarketCap(totalSupply: number, priceInUSDC: number): number {
  return totalSupply * priceInUSDC;
}

/**
 * Calculate issuance since launch
 * Formula: IssuanceSinceLaunch = CurrentTotalSupply - GenesisAllocation
 */
export function calculateIssuanceSinceLaunch(
  currentTotalSupply: number,
  genesisAllocation: number
): number {
  return currentTotalSupply - genesisAllocation;
}

/**
 * Calculate circulating supply (tokens not locked in specific categories)
 * Formula: CirculatingTokens = TotalSupply - (StakedSupply + DEXLiquiditySupply + CommunityPoolSupply)
 */
export function calculateCirculatingSupply(
  totalSupply: number,
  stakedSupply: number,
  dexLiquiditySupply: number,
  communityPoolSupply: number
): number {
  return totalSupply - (stakedSupply + dexLiquiditySupply + communityPoolSupply);
}

/**
 * Calculate percentage of total supply that is staked
 * Formula: %Staked = (CurrentStakedSupply / CurrentTotalSupply) × 100%
 */
export function calculateStakedPercentage(stakedSupply: number, totalSupply: number): number {
  if (totalSupply === 0) return 0;
  return (stakedSupply / totalSupply) * 100;
}

/**
 * Calculate comprehensive supply metrics
 */
export function calculateSupplyMetrics(
  currentSupplyData: SupplyData,
  context: CalculationContext,
  dexLiquiditySupply: number = 0,
  communityPoolSupply: number = 0
): SupplyMetrics {
  const { total: totalSupply, staked: stakedSupply, price } = currentSupplyData;
  const { genesisAllocation } = context.config;

  const issuanceSinceLaunch = calculateIssuanceSinceLaunch(totalSupply, genesisAllocation);
  const marketCap = price ? calculateMarketCap(totalSupply, price) : 0;
  const circulatingSupply = calculateCirculatingSupply(
    totalSupply,
    stakedSupply,
    dexLiquiditySupply,
    communityPoolSupply
  );

  return {
    totalSupply,
    genesisAllocation,
    issuanceSinceLaunch,
    marketCap,
    circulatingSupply,
  };
}

/**
 * Calculate genesis allocation vs issuance breakdown for charts
 */
export function calculateGenesisVsIssuanceBreakdown(
  totalSupply: number,
  genesisAllocation: number
): { genesis: number; issuance: number; genesisPercentage: number; issuancePercentage: number } {
  const issuance = calculateIssuanceSinceLaunch(totalSupply, genesisAllocation);
  const genesisPercentage = totalSupply > 0 ? (genesisAllocation / totalSupply) * 100 : 0;
  const issuancePercentage = totalSupply > 0 ? (issuance / totalSupply) * 100 : 0;

  return {
    genesis: genesisAllocation,
    issuance,
    genesisPercentage,
    issuancePercentage,
  };
}
