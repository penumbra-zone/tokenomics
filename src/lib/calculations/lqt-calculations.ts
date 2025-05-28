// Liquidity Tournament (LQT) Calculations
// Based on the tokenomics calculation documentation

import { LQTMetrics, CalculationContext } from './types';

// LQT-specific types
export interface LQTSummaryData {
  epoch: number;
  totalRewards: number;
  delegatorRewards: number;
  lpRewards: number;
  totalVotingPower: number;
}

export interface LQTLPData {
  positionId: Uint8Array;
  points: number;
  umVolume: number;
  assetVolume: number;
  epoch: number;
}

export interface LQTVotingPowerByAsset {
  asset: string;
  votes: number;
  share: number;
}

export interface LQTRankingEntry {
  rank: number;
  positionId: string; // hex-encoded
  liquidityProvided: number;
  points: number;
  volume: number;
}

/**
 * Calculate total available rewards for an epoch
 */
export function calculateTotalAvailableRewards(
  delegatorRewards: number,
  lpRewards: number
): number {
  return delegatorRewards + lpRewards;
}

/**
 * Calculate voting power share for an asset
 * Formula: Share = AssetVotes / TotalVotingPower
 */
export function calculateVotingPowerShare(
  assetVotes: number,
  totalVotingPower: number
): number {
  if (totalVotingPower === 0) return 0;
  return assetVotes / totalVotingPower;
}

/**
 * Calculate voting power breakdown by asset
 */
export function calculateVotingPowerByAsset(
  votingData: Array<{ asset: string; votes: number }>,
  totalVotingPower: number
): LQTVotingPowerByAsset[] {
  return votingData.map(data => ({
    asset: data.asset,
    votes: data.votes,
    share: calculateVotingPowerShare(data.votes, totalVotingPower),
  }));
}

/**
 * Convert position ID from bytes to hex string for display
 */
export function formatPositionId(positionId: Uint8Array): string {
  return Array.from(positionId)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Calculate liquidity provided metric for ranking
 * This can be based on points, volume, or a combination
 */
export function calculateLiquidityProvided(
  lpData: LQTLPData,
  method: 'points' | 'volume' | 'combined' = 'points'
): number {
  switch (method) {
    case 'points':
      return lpData.points;
    case 'volume':
      return lpData.umVolume + lpData.assetVolume;
    case 'combined':
      // Weighted combination of points and volume
      return lpData.points * 0.7 + (lpData.umVolume + lpData.assetVolume) * 0.3;
    default:
      return lpData.points;
  }
}

/**
 * Calculate LQT rankings for liquidity providers
 */
export function calculateLQTRankings(
  lpDataArray: LQTLPData[],
  rankingMethod: 'points' | 'volume' | 'combined' = 'points'
): LQTRankingEntry[] {
  // Calculate liquidity provided for each LP
  const lpWithMetrics = lpDataArray.map(lpData => ({
    positionId: formatPositionId(lpData.positionId),
    liquidityProvided: calculateLiquidityProvided(lpData, rankingMethod),
    points: lpData.points,
    volume: lpData.umVolume + lpData.assetVolume,
  }));

  // Sort by liquidity provided (descending)
  lpWithMetrics.sort((a, b) => b.liquidityProvided - a.liquidityProvided);

  // Add rankings
  return lpWithMetrics.map((lp, index) => ({
    rank: index + 1,
    positionId: lp.positionId,
    liquidityProvided: lp.liquidityProvided,
    points: lp.points,
    volume: lp.volume,
  }));
}

/**
 * Calculate reward distribution percentages
 */
export function calculateRewardDistribution(
  totalRewards: number,
  delegatorRewards: number,
  lpRewards: number
): {
  delegatorPercentage: number;
  lpPercentage: number;
  isValid: boolean;
} {
  const calculatedTotal = delegatorRewards + lpRewards;
  const isValid = Math.abs(totalRewards - calculatedTotal) < 0.01;

  const delegatorPercentage = totalRewards > 0 ? (delegatorRewards / totalRewards) * 100 : 0;
  const lpPercentage = totalRewards > 0 ? (lpRewards / totalRewards) * 100 : 0;

  return {
    delegatorPercentage,
    lpPercentage,
    isValid,
  };
}

/**
 * Calculate comprehensive LQT metrics for an epoch
 */
export function calculateLQTMetrics(
  summaryData: LQTSummaryData,
  votingPowerData: Array<{ asset: string; votes: number }>,
  context: CalculationContext
): LQTMetrics & {
  votingPowerByAsset: LQTVotingPowerByAsset[];
  rewardDistribution: {
    delegatorPercentage: number;
    lpPercentage: number;
  };
} {
  const { totalRewards, delegatorRewards, lpRewards, totalVotingPower } = summaryData;

  // Calculate voting power breakdown
  const votingPowerByAsset = calculateVotingPowerByAsset(votingPowerData, totalVotingPower);

  // Calculate reward distribution
  const rewardDistribution = calculateRewardDistribution(
    totalRewards,
    delegatorRewards,
    lpRewards
  );

  return {
    availableRewards: totalRewards,
    delegatorRewards,
    lpRewards,
    totalVotingPower,
    votingPowerByAsset,
    rewardDistribution: {
      delegatorPercentage: rewardDistribution.delegatorPercentage,
      lpPercentage: rewardDistribution.lpPercentage,
    },
  };
}

/**
 * Calculate LP performance metrics
 */
export function calculateLPPerformanceMetrics(
  lpData: LQTLPData[]
): {
  totalPoints: number;
  totalVolume: number;
  averagePoints: number;
  averageVolume: number;
  topPerformer: LQTLPData | null;
} {
  if (lpData.length === 0) {
    return {
      totalPoints: 0,
      totalVolume: 0,
      averagePoints: 0,
      averageVolume: 0,
      topPerformer: null,
    };
  }

  const totalPoints = lpData.reduce((sum, lp) => sum + lp.points, 0);
  const totalVolume = lpData.reduce((sum, lp) => sum + lp.umVolume + lp.assetVolume, 0);
  
  const averagePoints = totalPoints / lpData.length;
  const averageVolume = totalVolume / lpData.length;

  // Find top performer by points
  const topPerformer = lpData.reduce((top, current) => 
    current.points > top.points ? current : top
  );

  return {
    totalPoints,
    totalVolume,
    averagePoints,
    averageVolume,
    topPerformer,
  };
}

/**
 * Calculate epoch participation statistics
 */
export function calculateEpochParticipation(
  lpData: LQTLPData[]
): {
  totalParticipants: number;
  activeParticipants: number; // Those with points > 0
  participationRate: number;
} {
  const totalParticipants = lpData.length;
  const activeParticipants = lpData.filter(lp => lp.points > 0).length;
  const participationRate = totalParticipants > 0 ? (activeParticipants / totalParticipants) * 100 : 0;

  return {
    totalParticipants,
    activeParticipants,
    participationRate,
  };
} 