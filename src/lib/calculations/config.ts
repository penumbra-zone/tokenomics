// Calculation Configuration
// Centralized configuration for all tokenomics calculations

import { CalculationConfig } from './types';

/**
 * Default calculation configuration
 * These values should be updated based on the actual network parameters
 */
export const DEFAULT_CALCULATION_CONFIG: CalculationConfig = {
  // Genesis allocation - should be set to the actual genesis allocation amount
  // Note: Genesis data source is pending - initial genesis.json for mainnet needs to be located
  genesisAllocation: 1_000_000_000, // 1B tokens (placeholder until genesis data is available)
  
  // Network parameters
  blocksPerDay: 14400, // Assuming ~6 second block times (24*60*60/6)
  
  // Time windows for calculations
  inflationWindowDays: 30, // Default window for inflation calculations
  
  // Community pool addresses - should be updated with actual addresses
  // Note: Community pool balances available via viewService
  communityPoolAddresses: [
    // Add actual community pool addresses here
    'penumbra1...',
  ],
};

/**
 * Network-specific configurations
 */
export const NETWORK_CONFIGS = {
  mainnet: {
    ...DEFAULT_CALCULATION_CONFIG,
    genesisAllocation: 1_000_000_000, // Update with actual mainnet genesis allocation
    blocksPerDay: 14400, // Update with actual mainnet block time
    communityPoolAddresses: [
      // Add actual mainnet community pool addresses
    ],
  },
  
  testnet: {
    ...DEFAULT_CALCULATION_CONFIG,
    genesisAllocation: 100_000_000, // Smaller testnet allocation
    blocksPerDay: 7200, // Potentially different block times
    communityPoolAddresses: [
      // Add actual testnet community pool addresses
    ],
  },
  
  devnet: {
    ...DEFAULT_CALCULATION_CONFIG,
    genesisAllocation: 10_000_000, // Even smaller devnet allocation
    blocksPerDay: 3600, // Faster blocks for development
    communityPoolAddresses: [
      // Add actual devnet community pool addresses
    ],
  },
};

/**
 * Calculation precision settings
 */
export const PRECISION_CONFIG = {
  // Number of decimal places for different metrics
  percentages: 2,
  tokenAmounts: 6,
  rates: 8,
  prices: 4,
  
  // Tolerance for validation checks
  validationTolerance: 0.01,
  
  // Rounding modes
  roundingMode: 'round' as 'round' | 'floor' | 'ceil',
};

/**
 * Time period configurations
 */
export const TIME_PERIODS = {
  '7d': {
    days: 7,
    label: '7 Days',
    shortLabel: '7D',
  },
  '30d': {
    days: 30,
    label: '30 Days',
    shortLabel: '30D',
  },
  '90d': {
    days: 90,
    label: '90 Days',
    shortLabel: '90D',
  },
  '1y': {
    days: 365,
    label: '1 Year',
    shortLabel: '1Y',
  },
} as const;

/**
 * Chart configuration for calculations
 */
export const CHART_CONFIG = {
  // Default number of data points for time series charts
  defaultDataPoints: 90,
  
  // Maximum number of data points to prevent performance issues
  maxDataPoints: 365,
  
  // Minimum number of data points for meaningful calculations
  minDataPoints: 7,
  
  // Default aggregation intervals
  aggregationIntervals: {
    hourly: 'hour',
    daily: 'day',
    weekly: 'week',
    monthly: 'month',
  } as const,
};

/**
 * LQT (Liquidity Tournament) specific configuration
 */
export const LQT_CONFIG = {
  // Default ranking method for LPs
  defaultRankingMethod: 'points' as const,
  
  // Weights for combined ranking method
  combinedRankingWeights: {
    points: 0.7,
    volume: 0.3,
  },
  
  // Minimum points threshold for active participation
  minPointsThreshold: 0.01,
  
  // Default epoch duration (in days)
  epochDurationDays: 30,
};

/**
 * Burn calculation configuration
 */
export const BURN_CONFIG = {
  // Categories of burns to track (based on supply_total_unstaked table)
  burnCategories: [
    'fees', // fee_burns from supply_total_unstaked.fees
    'arb',  // arbitrage_burns from supply_total_unstaked.arb
  ] as const,
  
  // Note: DEX burns and auction burns are not separate fields in supply_total_unstaked
  // They may be included in the arb and fees categories
  
  // Default burn rate calculation method
  defaultBurnRateMethod: 'daily' as const,
  
  // Burn rate smoothing window (in days)
  burnRateSmoothingWindow: 7,
};

/**
 * Distribution calculation configuration
 */
export const DISTRIBUTION_CONFIG = {
  // Categories for token distribution (based on actual data sources)
  distributionCategories: [
    'staked',      // insights_supply.staked
    'dexLiquidity', // supply_total_unstaked.dex
    'auctionLocked', // supply_total_unstaked.auction
    'circulating',  // supply_total_unstaked.um
  ] as const,
  
  // Minimum percentage threshold for "Other" category in charts
  otherCategoryThreshold: 1.0, // 1%
  
  // Validation tolerance for distribution totals
  distributionValidationTolerance: 0.001, // 0.1%
};

/**
 * Issuance calculation configuration
 */
export const ISSUANCE_CONFIG = {
  // Issuance type - should be net issuance (issuance - burns)
  issuanceType: 'net' as 'gross' | 'net',
  
  // Source for issuance per block constant
  issuancePerBlockSource: 'viewService.appParams.distributionParams',
  
  // Default calculation method for current issuance
  currentIssuanceMethod: 'supply_change' as 'supply_change' | 'block_constant',
};

/**
 * Get configuration for a specific network
 */
export function getNetworkConfig(network: keyof typeof NETWORK_CONFIGS): CalculationConfig {
  return NETWORK_CONFIGS[network] || DEFAULT_CALCULATION_CONFIG;
}

/**
 * Get current network configuration based on environment
 */
export function getCurrentNetworkConfig(): CalculationConfig {
  // This should be determined based on your environment variables
  // For now, defaulting to mainnet
  const network = process.env.NEXT_PUBLIC_NETWORK as keyof typeof NETWORK_CONFIGS || 'mainnet';
  return getNetworkConfig(network);
}

/**
 * Utility function to format numbers based on precision config
 */
export function formatNumber(
  value: number,
  type: 'percentages' | 'tokenAmounts' | 'rates' | 'prices',
  options?: Intl.NumberFormatOptions
): string {
  const decimals = PRECISION_CONFIG[type];
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    ...options,
  }).format(value);
}

/**
 * Utility function to round numbers based on precision config
 */
export function roundNumber(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  
  switch (PRECISION_CONFIG.roundingMode) {
    case 'floor':
      return Math.floor(value * factor) / factor;
    case 'ceil':
      return Math.ceil(value * factor) / factor;
    case 'round':
    default:
      return Math.round(value * factor) / factor;
  }
} 