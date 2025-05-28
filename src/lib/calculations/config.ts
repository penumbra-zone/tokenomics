// Calculation Configuration
// Centralized configuration for all tokenomics calculations

import { CalculationConfig } from "./types";

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
    "penumbra1...",
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
  const network = (process.env.NEXT_PUBLIC_NETWORK as keyof typeof NETWORK_CONFIGS) || "mainnet";
  return getNetworkConfig(network);
}
