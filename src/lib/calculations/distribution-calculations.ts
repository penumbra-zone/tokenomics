// Token Distribution Calculations
// Based on the tokenomics calculation documentation

import { 
  SupplyData, 
  DistributionMetrics, 
  UnstakedSupplyComponents, 
  DelegatedSupplyComponent,
  CalculationContext 
} from './types';

/**
 * Calculate circulating tokens (tokens not locked in specific categories)
 * Formula: CirculatingTokens = TotalSupply - (StakedSupply + DEXLiquiditySupply + CommunityPoolSupply)
 */
export function calculateCirculatingTokens(
  totalSupply: number,
  stakedSupply: number,
  dexLiquiditySupply: number,
  communityPoolSupply: number
): number {
  return totalSupply - (stakedSupply + dexLiquiditySupply + communityPoolSupply);
}

/**
 * Calculate percentage staked
 * Formula: %Staked = (CurrentStakedSupply / CurrentTotalSupply) × 100%
 */
export function calculatePercentageStaked(
  stakedSupply: number,
  totalSupply: number
): number {
  if (totalSupply === 0) return 0;
  return (stakedSupply / totalSupply) * 100;
}

/**
 * Calculate total unstaked supply from components
 */
export function calculateTotalUnstakedSupply(
  unstakedComponents: UnstakedSupplyComponents
): number {
  return (
    unstakedComponents.um +
    unstakedComponents.auction +
    unstakedComponents.dex +
    unstakedComponents.arb +
    unstakedComponents.fees
  );
}

/**
 * Calculate total delegated supply from components
 */
export function calculateTotalDelegatedSupply(
  delegatedComponents: DelegatedSupplyComponent[]
): {
  totalDelegatedBase: number;
  totalDelegatedDelegated: number;
  avgConversionRate: number;
} {
  const totalDelegatedBase = delegatedComponents.reduce((sum, v) => sum + v.um, 0);
  const totalDelegatedDelegated = delegatedComponents.reduce((sum, v) => sum + v.del_um, 0);
  
  const avgConversionRate = delegatedComponents.length > 0
    ? delegatedComponents.reduce((sum, v) => sum + v.rate_bps2, 0) / (delegatedComponents.length * 10000)
    : 0;

  return {
    totalDelegatedBase,
    totalDelegatedDelegated,
    avgConversionRate,
  };
}

/**
 * Calculate total supply from components
 */
export function calculateTotalSupplyFromComponents(
  unstakedComponents: UnstakedSupplyComponents,
  delegatedComponents: DelegatedSupplyComponent[]
): number {
  const totalUnstaked = calculateTotalUnstakedSupply(unstakedComponents);
  const { totalDelegatedBase, totalDelegatedDelegated } = calculateTotalDelegatedSupply(delegatedComponents);
  
  return totalUnstaked + totalDelegatedBase + totalDelegatedDelegated;
}

/**
 * Calculate DEX liquidity supply from unstaked components
 */
export function calculateDEXLiquiditySupply(
  unstakedComponents: UnstakedSupplyComponents
): number {
  return unstakedComponents.dex;
}

/**
 * Calculate token distribution breakdown for pie charts
 */
export function calculateTokenDistributionBreakdown(
  totalSupply: number,
  stakedSupply: number,
  dexLiquiditySupply: number,
  communityPoolSupply: number
): {
  staked: { amount: number; percentage: number };
  dexLiquidity: { amount: number; percentage: number };
  communityPool: { amount: number; percentage: number };
  circulating: { amount: number; percentage: number };
} {
  const circulatingSupply = calculateCirculatingTokens(
    totalSupply,
    stakedSupply,
    dexLiquiditySupply,
    communityPoolSupply
  );

  const calculatePercentage = (amount: number) => 
    totalSupply > 0 ? (amount / totalSupply) * 100 : 0;

  return {
    staked: {
      amount: stakedSupply,
      percentage: calculatePercentage(stakedSupply),
    },
    dexLiquidity: {
      amount: dexLiquiditySupply,
      percentage: calculatePercentage(dexLiquiditySupply),
    },
    communityPool: {
      amount: communityPoolSupply,
      percentage: calculatePercentage(communityPoolSupply),
    },
    circulating: {
      amount: circulatingSupply,
      percentage: calculatePercentage(circulatingSupply),
    },
  };
}

/**
 * Calculate staking breakdown with subcategories
 */
export function calculateStakingBreakdown(
  delegatedComponents: DelegatedSupplyComponent[]
): {
  validators: { amount: number; percentage: number };
  delegators: { amount: number; percentage: number };
  total: number;
} {
  const { totalDelegatedBase, totalDelegatedDelegated } = calculateTotalDelegatedSupply(delegatedComponents);
  const totalStaked = totalDelegatedBase + totalDelegatedDelegated;

  const calculatePercentage = (amount: number) => 
    totalStaked > 0 ? (amount / totalStaked) * 100 : 0;

  return {
    validators: {
      amount: totalDelegatedBase,
      percentage: calculatePercentage(totalDelegatedBase),
    },
    delegators: {
      amount: totalDelegatedDelegated,
      percentage: calculatePercentage(totalDelegatedDelegated),
    },
    total: totalStaked,
  };
}

/**
 * Calculate comprehensive distribution metrics
 */
export function calculateDistributionMetrics(
  currentSupplyData: SupplyData,
  unstakedComponents: UnstakedSupplyComponents,
  delegatedComponents: DelegatedSupplyComponent[],
  communityPoolSupply: number,
  context: CalculationContext
): DistributionMetrics {
  const { total: totalSupply, staked: stakedSupply } = currentSupplyData;
  
  // Calculate DEX liquidity from unstaked components
  const dexLiquidity = calculateDEXLiquiditySupply(unstakedComponents);
  
  // Calculate circulating supply
  const circulating = calculateCirculatingTokens(
    totalSupply,
    stakedSupply,
    dexLiquidity,
    communityPoolSupply
  );

  // Calculate percentage staked
  const percentageStaked = calculatePercentageStaked(stakedSupply, totalSupply);

  return {
    staked: stakedSupply,
    dexLiquidity,
    communityPool: communityPoolSupply,
    circulating,
    percentageStaked,
  };
}

/**
 * Validate distribution totals (should equal total supply)
 */
export function validateDistributionTotals(
  totalSupply: number,
  distributionBreakdown: {
    staked: { amount: number };
    dexLiquidity: { amount: number };
    communityPool: { amount: number };
    circulating: { amount: number };
  }
): {
  isValid: boolean;
  calculatedTotal: number;
  difference: number;
} {
  const calculatedTotal = 
    distributionBreakdown.staked.amount +
    distributionBreakdown.dexLiquidity.amount +
    distributionBreakdown.communityPool.amount +
    distributionBreakdown.circulating.amount;

  const difference = Math.abs(totalSupply - calculatedTotal);
  const isValid = difference < 0.01; // Allow for small rounding errors

  return {
    isValid,
    calculatedTotal,
    difference,
  };
} 