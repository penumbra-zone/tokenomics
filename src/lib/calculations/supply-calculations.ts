// Supply Visualization Calculations

import { UnstakedSupplyComponents } from "../db/pindexer";
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
 * Calculate total unstaked supply from components
 */
export function calculateTotalUnstakedSupply(unstakedComponents: UnstakedSupplyComponents): number {
  return (
    Number(unstakedComponents.um) +
    Number(unstakedComponents.auction) +
    Number(unstakedComponents.dex) +
    Number(unstakedComponents.arb) +
    Number(unstakedComponents.fees)
  );
}
