// Types for calculation inputs and outputs

// Base data types from database
export interface SupplyData {
  total: number;
  staked: number;
  height: number;
  timestamp: Date;
  marketCap?: number;
  price?: number;
}

export interface BurnData {
  fees: number;
  dexArb: number;
  auctionBurns: number;
  dexBurns: number;
  height: number;
  timestamp: Date;
}

export interface UnstakedSupplyComponents {
  um: number;
  auction: number;
  dex: number;
  arb: number;
  fees: number;
}

export interface DelegatedSupplyComponent {
  um: number;
  del_um: number;
  rate_bps2: number;
}

export interface PriceHistoryEntry {
  date: string;
  price: number;
  marketCap: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

// Calculation result types
export interface SupplyMetrics {
  totalSupply: number;
  genesisAllocation: number;
  issuanceSinceLaunch: number;
  marketCap: number;
  circulatingSupply: number;
}

export interface IssuanceMetrics {
  currentDailyIssuance: number;
  projectedAnnualIssuance: number;
  inflationRateLastMonth: number;
  inflationRateForPeriod: number;
}

export interface BurnMetrics {
  totalBurned: number;
  percentageOfSupplyBurned: number;
  burnRatePerDay: number;
  burnsBySource: {
    transactionFees: number;
    dexArbitrage: number;
    auctionBurns: number;
    dexBurns: number;
  };
}

export interface DistributionMetrics {
  staked: number;
  dexLiquidity: number;
  communityPool: number;
  circulating: number;
  percentageStaked: number;
}

export interface LQTMetrics {
  availableRewards: number;
  delegatorRewards: number;
  lpRewards: number;
  totalVotingPower: number;
}

// Calculation configuration
export interface CalculationConfig {
  genesisAllocation: number;
  blocksPerDay: number;
  inflationWindowDays: number;
  communityPoolAddresses: string[];
}

// Time period types
export type TimePeriod = "7d" | "30d" | "90d" | "1y";

// Calculation context
export interface CalculationContext {
  config: CalculationConfig;
  currentHeight: number;
  currentTimestamp: Date;
}
