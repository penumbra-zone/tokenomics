/**
 * Genesis file parser for calculating total allocations
 */

interface GenesisAllocation {
  amount: {
    lo: string;
    hi?: string;
  };
  denom: string;
  address: {
    inner: string;
  };
}

interface GenesisData {
  genesis_time: string;
  chain_id: string;
  consensus_params: {
    block: {
      time_iota_ms: string;
    };
  };
  app_state: {
    genesisContent: {
      chainId: string;
      shieldedPoolContent: {
        allocations: GenesisAllocation[];
      };
      distributionsContent: {
        distributionsParams: {
          stakingIssuancePerBlock: string;
        };
      };
      sctContent: {
        sctParams: {
          epochDuration: string;
        };
      };
      communityPoolContent: {
        initialBalance: {
          amount: {
            lo: string;
            hi?: string;
          };
        };
      };
      stakeContent: {
        stakeParams: {
          activeValidatorLimit: string;
          unbondingDelay: string;
          minValidatorStake: {
            lo: string;
          };
        };
      };
      governanceContent: {
        governanceParams: {
          proposalVotingBlocks: string;
          proposalDepositAmount: {
            lo: string;
          };
        };
      };
    };
  };
}

export interface AllocationSummary {
  totalPenumbra: bigint;
  totalSupply: bigint;
  allocations: {
    [denom: string]: bigint;
  };
  addressCount: number;
  uniqueAddresses: number;
}

export interface GenesisConfig {
  genesisTime: string;
  chainId: string;
  blockTimeMs: number;
  blocksPerDay: number;
  epochDuration: number;
  stakingIssuancePerBlock: number;
  communityPoolInitialBalance: bigint;
  proposalVotingBlocks: number;
  proposalDepositAmount: number;
  activeValidatorLimit: number;
  unbondingDelay: number;
  minValidatorStake: number;
  allocationSummary: AllocationSummary;
}

/**
 * Convert lo/hi amount to bigint
 */
function parseAmount(amount: { lo: string; hi?: string }): bigint {
  const lo = BigInt(amount.lo);
  const hi = amount.hi ? BigInt(amount.hi) : BigInt(0);
  return lo + (hi << BigInt(64));
}

/**
 * Parse genesis data and calculate allocations
 */
export function parseGenesisAllocations(genesisData: GenesisData): AllocationSummary {
  const allocations: { [denom: string]: bigint } = {};
  const uniqueAddresses = new Set<string>();

  for (const allocation of genesisData.app_state.genesisContent.shieldedPoolContent.allocations) {
    const amount = parseAmount(allocation.amount);
    const denom = allocation.denom;

    // Track total per denomination
    if (!allocations[denom]) {
      allocations[denom] = BigInt(0);
    }
    allocations[denom] += amount;

    // Track unique addresses
    uniqueAddresses.add(allocation.address.inner);
  }

  const totalPenumbra = allocations["upenumbra"] || BigInt(0);
  const totalSupply = Object.values(allocations).reduce((sum, amount) => sum + amount, BigInt(0));

  return {
    totalPenumbra,
    totalSupply,
    allocations,
    addressCount: genesisData.app_state.genesisContent.shieldedPoolContent.allocations.length,
    uniqueAddresses: uniqueAddresses.size,
  };
}

/**
 * Parse full genesis configuration
 */
export function parseGenesisConfig(genesisData: GenesisData): GenesisConfig {
  const blockTimeMs = parseInt(genesisData.consensus_params.block.time_iota_ms);
  const blocksPerDay = Math.floor((24 * 60 * 60 * 1000) / blockTimeMs);

  const allocationSummary = parseGenesisAllocations(genesisData);

  return {
    genesisTime: genesisData.genesis_time,
    chainId: genesisData.chain_id,
    blockTimeMs,
    blocksPerDay,
    epochDuration: parseInt(
      genesisData.app_state.genesisContent.sctContent.sctParams.epochDuration
    ),
    stakingIssuancePerBlock: parseInt(
      genesisData.app_state.genesisContent.distributionsContent.distributionsParams
        .stakingIssuancePerBlock
    ),
    communityPoolInitialBalance: parseAmount(
      genesisData.app_state.genesisContent.communityPoolContent.initialBalance.amount
    ),
    proposalVotingBlocks: parseInt(
      genesisData.app_state.genesisContent.governanceContent.governanceParams.proposalVotingBlocks
    ),
    proposalDepositAmount: parseInt(
      genesisData.app_state.genesisContent.governanceContent.governanceParams.proposalDepositAmount
        .lo
    ),
    activeValidatorLimit: parseInt(
      genesisData.app_state.genesisContent.stakeContent.stakeParams.activeValidatorLimit
    ),
    unbondingDelay: parseInt(
      genesisData.app_state.genesisContent.stakeContent.stakeParams.unbondingDelay
    ),
    minValidatorStake: parseInt(
      genesisData.app_state.genesisContent.stakeContent.stakeParams.minValidatorStake.lo
    ),
    allocationSummary,
  };
}

/**
 * Load and parse genesis file
 */
export async function loadGenesisConfig(network: "mainnet" | "testnet"): Promise<GenesisConfig> {
  // Import the JSON files directly
  if (network === "mainnet") {
    const genesisData = await import("./mainnet.json");
    return parseGenesisConfig(genesisData.default as any);
  } else {
    const genesisData = await import("./testnet.json");
    return parseGenesisConfig(genesisData.default as any);
  }
}
