import { ChainRegistryClient, Registry } from '@penumbra-labs/registry';
import { AssetId } from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import { getChainId } from './chain-id';
import { getAssetMetadataById } from './assets';

/**
 * Registry Client Instance
 * 
 * This is the main registry client that provides access to Penumbra's
 * chain registry data including assets, staking information, and IBC connections.
 */
export const registryClient = new ChainRegistryClient();

// =============================================================================
// ASSET METADATA FUNCTIONS
// =============================================================================

/**
 * Get staking token metadata for the current chain
 * @returns Promise<Metadata | undefined> The staking token metadata or undefined if not found
 */
export const getStakingTokenMetadata = async () => {
  const chainId = await getChainId();
  if (!chainId) {
    throw new Error('Could not fetch chain id');
  }

  const { stakingAssetId } = registryClient.bundled.globals();
  const stakingAssetsMetadata = await getAssetMetadataById(stakingAssetId);

  if (!stakingAssetsMetadata) {
    throw new Error('Could not fetch staking asset metadata');
  }
  return stakingAssetsMetadata;
};

/**
 * Get asset token metadata by asset ID
 * @param assetId The asset ID to look up
 * @returns Promise<Metadata | undefined> The asset metadata or undefined if not found
 */
export const getAssetTokenMetadata = async (assetId: AssetId) => {
  const chainId = await getChainId();
  if (!chainId) {
    throw new Error('Could not fetch chain id');
  }

  const assetTokenMetadata = await getAssetMetadataById(assetId);

  if (!assetTokenMetadata) {
    throw new Error('Could not fetch asset token metadata');
  }
  return assetTokenMetadata;
};

// =============================================================================
// CHAIN REGISTRY FUNCTIONS
// =============================================================================

/**
 * Get all IBC chains connected to the current chain
 * @returns Promise<Chain[]> Array of connected chains
 */
export const getChains = async () => {
  const chainId = await getChainId();
  if (!chainId) {
    throw new Error('Could not fetch chain id');
  }

  const { ibcConnections } = await registryClient.remote.get(chainId);
  return ibcConnections;
};

/**
 * Get all assets from the registry for the current chain
 * @returns Promise<Asset[]> Array of all assets
 */
export const getAllAssets = async () => {
  const chainId = await getChainId();
  if (!chainId) {
    throw new Error('Could not fetch chain id');
  }

  const registry = await registryClient.remote.get(chainId);
  return registry.getAllAssets();
};

/**
 * Get the staking asset ID for the current chain
 * @returns AssetId The staking asset ID
 */
export const getStakingAssetId = () => {
  const { stakingAssetId } = registryClient.bundled.globals();
  return stakingAssetId;
};

// =============================================================================
// RE-EXPORTS
// =============================================================================

// Re-export utilities
export { getChainId, getChainIdSync } from './chain-id';
export { getAssetMetadataById, type AssetMetadata } from './assets';
export { findUSDCAssetId, getUSDCAssetMetadata } from './utils'; 