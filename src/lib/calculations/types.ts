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
  arbitrageBurns: number;
  feeBurns: number;
  height: string;
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
    arbitrageBurns: number;
    feeBurns: number;
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

  // Network parameters from genesis
  epochDuration?: number; // blocks per epoch
  stakingIssuancePerBlock?: number; // staking rewards issued per block

  // Governance parameters
  proposalVotingBlocks?: number; // blocks for proposal voting period
  proposalDepositAmount?: number; // minimum deposit for proposals

  // Staking parameters
  activeValidatorLimit?: number; // maximum number of active validators
  unbondingDelay?: number; // unbonding period in blocks
  minValidatorStake?: number; // minimum stake required for validators

  // Community pool
  communityPoolInitialBalance?: number; // initial community pool balance

  // Genesis metadata
  genesisTime?: string; // genesis timestamp
  chainId?: string; // chain identifier
}

// Time period types
export type TimePeriod = "7d" | "30d" | "90d" | "1y";

// Calculation context
export interface CalculationContext {
  config: CalculationConfig;
  currentHeight: number;
  currentTimestamp: Date;
}
