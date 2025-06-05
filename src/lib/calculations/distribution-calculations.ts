// Token Distribution Calculations

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
export function calculatePercentageStaked(stakedSupply: number, totalSupply: number): number {
  if (totalSupply === 0) return 0;
  return (stakedSupply / totalSupply) * 100;
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
