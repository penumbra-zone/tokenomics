import { AssetId, Metadata } from "@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb";
import { getChainId } from "./chain-id";
import { getAssetMetadataById, registryClient } from "./index";
import { pnum } from "@penumbra-zone/types/pnum";
import { getDisplayDenomExponent } from "@penumbra-zone/getters/metadata";

/**
 * Find USDC asset ID from the Penumbra registry
 * @returns AssetId for USDC or null if not found
 */
export async function findUSDCAssetId(): Promise<AssetId | null> {
  try {
    const chainId = await getChainId();
    if (!chainId) {
      return null;
    }

    const registry = await registryClient.remote.get(chainId);
    const assets = registry.getAllAssets();

    // Find USDC asset by looking for USDC in symbol
    const usdcAsset = assets.find((asset) => {
      const symbol = asset.symbol?.toLowerCase() || "";
      return symbol === "usdc";
    });

    if (usdcAsset?.penumbraAssetId) {
      return usdcAsset.penumbraAssetId;
    }

    return null;
  } catch (error) {
    console.error("Error finding USDC asset:", error);
    return null;
  }
}

/**
 * Get USDC asset metadata from the Penumbra registry
 * @returns Metadata for USDC asset or null if not found
 */
export async function getUSDCAssetMetadata(): Promise<Metadata | undefined> {
  try {
    const chainId = await getChainId();
    if (!chainId) {
      return undefined;
    }

    const usdcAssetId = await findUSDCAssetId();
    if (!usdcAssetId) {
      return undefined;
    }

    return getAssetMetadataById(usdcAssetId);
  } catch (error) {
    console.error("Error getting USDC asset metadata:", error);
    return undefined;
  }
}

// Get UM metadata from the Penumbra registry
export async function getUmAssetMetadata(): Promise<Metadata | undefined> {
  const chainId = await getChainId();
  if (!chainId) {
    return undefined;
  }

  const registry = await registryClient.remote.get(chainId);
  const assets = registry.getAllAssets();

  const umAsset = assets.find((asset) => {
    const symbol = asset.symbol?.toLowerCase() || "";
    return symbol === "um";
  });

  if (umAsset?.penumbraAssetId) {
    return getAssetMetadataById(umAsset.penumbraAssetId);
  }

  return undefined;
}

export function formatAssetAmount(baseAmount: bigint, metadata: Metadata): string {
  const displayExponent = getDisplayDenomExponent(metadata);

  return pnum(baseAmount, displayExponent).toFormattedString({
    decimals: Math.min(displayExponent ?? 0, 6),
    commas: false,
    trailingZeros: false,
  });
}
