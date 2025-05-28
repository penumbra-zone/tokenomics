// Calculation Configuration
// Centralized configuration for all tokenomics calculations

import mainnetGenesis from "../genesis/mainnet.json";
import { parseGenesisConfig } from "../genesis/genesisFileParser";
import testnetGenesis from "../genesis/testnet.json";
import { CalculationConfig } from "./types";

// Parse genesis configurations
const mainnetConfig = parseGenesisConfig(mainnetGenesis as any);
const testnetConfig = parseGenesisConfig(testnetGenesis as any);

/**
 * Default calculation configuration
 * These values are based on the actual Penumbra mainnet genesis data
 */
export const DEFAULT_CALCULATION_CONFIG: CalculationConfig = {
  // Genesis allocation - calculated from actual mainnet genesis
  genesisAllocation: Number(mainnetConfig.allocationSummary.totalPenumbra), // Convert bigint to number

  // Network parameters from genesis
  blocksPerDay: mainnetConfig.blocksPerDay, // Calculated from actual block time

  // Actual mainnet parameters from genesis
  epochDuration: mainnetConfig.epochDuration,
  stakingIssuancePerBlock: mainnetConfig.stakingIssuancePerBlock,

  // Governance parameters
  proposalVotingBlocks: mainnetConfig.proposalVotingBlocks,
  proposalDepositAmount: mainnetConfig.proposalDepositAmount,

  // Staking parameters
  activeValidatorLimit: mainnetConfig.activeValidatorLimit,
  unbondingDelay: mainnetConfig.unbondingDelay,
  minValidatorStake: mainnetConfig.minValidatorStake,

  // Community pool
  communityPoolInitialBalance: Number(mainnetConfig.communityPoolInitialBalance),

  // Time windows for calculations
  inflationWindowDays: 30, // Default window for inflation calculations

  // Genesis metadata
  genesisTime: mainnetConfig.genesisTime,
  chainId: mainnetConfig.chainId,
};

/**
 * Network-specific configurations
 */
export const NETWORK_CONFIGS = {
  mainnet: {
    ...DEFAULT_CALCULATION_CONFIG,
    // All mainnet values are already in DEFAULT_CALCULATION_CONFIG from genesis
    genesisAllocation: Number(mainnetConfig.allocationSummary.totalPenumbra),
    blocksPerDay: mainnetConfig.blocksPerDay,
  },

  testnet: {
    ...DEFAULT_CALCULATION_CONFIG,
    // Actual testnet values from genesis
    genesisAllocation: Number(testnetConfig.allocationSummary.totalPenumbra),
    blocksPerDay: testnetConfig.blocksPerDay,

    // Actual testnet parameters from genesis
    epochDuration: testnetConfig.epochDuration,
    stakingIssuancePerBlock: testnetConfig.stakingIssuancePerBlock,

    // Governance parameters - faster for testing
    proposalVotingBlocks: testnetConfig.proposalVotingBlocks,
    proposalDepositAmount: testnetConfig.proposalDepositAmount,

    // Staking parameters - lower barriers for testing
    activeValidatorLimit: testnetConfig.activeValidatorLimit,
    unbondingDelay: testnetConfig.unbondingDelay,
    minValidatorStake: testnetConfig.minValidatorStake,

    // Community pool
    communityPoolInitialBalance: Number(testnetConfig.communityPoolInitialBalance),

    // Genesis metadata
    genesisTime: testnetConfig.genesisTime,
    chainId: testnetConfig.chainId,
  },

  devnet: {
    ...DEFAULT_CALCULATION_CONFIG,
    genesisAllocation: 10_000_000, // Even smaller devnet allocation
    blocksPerDay: 3600, // Faster blocks for development
    epochDuration: 1440, // Much shorter epochs for development
    stakingIssuancePerBlock: 6341, // Potentially different issuance
    communityPoolAddresses: [
      // Add actual devnet community pool addresses
    ],
  },
};

/**
 * Get genesis allocation summary for a network
 */
export function getGenesisAllocationSummary(network: "mainnet" | "testnet") {
  const config = network === "mainnet" ? mainnetConfig : testnetConfig;
  return {
    totalPenumbra: config.allocationSummary.totalPenumbra,
    totalSupply: config.allocationSummary.totalSupply,
    allocations: config.allocationSummary.allocations,
    addressCount: config.allocationSummary.addressCount,
    uniqueAddresses: config.allocationSummary.uniqueAddresses,
    // Convert to human readable
    totalPenumbraReadable: Number(config.allocationSummary.totalPenumbra) / 1_000_000, // Convert to full tokens
    totalSupplyReadable: Number(config.allocationSummary.totalSupply) / 1_000_000,
  };
}

/**
 * Calculate annual inflation rate based on genesis parameters
 */
export function calculateAnnualInflationRate(
  stakingIssuancePerBlock: number,
  blocksPerDay: number,
  totalSupply: number
): number {
  const dailyIssuance = stakingIssuancePerBlock * blocksPerDay;
  const annualIssuance = dailyIssuance * 365;
  return (annualIssuance / totalSupply) * 100;
}

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
