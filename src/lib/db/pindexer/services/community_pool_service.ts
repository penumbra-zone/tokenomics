import { AssetId } from "@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb";
import { CommunityPoolAssetBalancesResponse } from "@penumbra-zone/protobuf/penumbra/core/component/community_pool/v1/community_pool_pb";

// TODO: Replace with proper server-side gRPC client
// The browser-based penumbra client cannot be used on the server side
// import { penumbra } from '../../../penumbra/client';
// import { QueryService } from '@penumbra-zone/protobuf/penumbra/core/component/community_pool/v1/community_pool_connect';

// Type interfaces for the response structure
interface AssetBalance {
  assetId: AssetId;
  amount: {
    lo: number | string;
    hi?: number | string;
  };
}

interface CommunityPoolResponse {
  balances: AssetBalance[];
}

/**
 * Service for interacting with Community Pool data
 * This service handles fetching community pool balances and related information
 *
 * Note: Currently uses mock data as the Penumbra browser client cannot be used server-side
 * TODO: Implement proper server-side gRPC connection to Penumbra node
 */
export class CommunityPoolService {
  constructor() {
    // Mock implementation for server-side usage
  }

  getCommunityPoolAssetBalances(
    assetIds: AssetId[]
  ): AsyncIterable<CommunityPoolAssetBalancesResponse> {
    // TODO: Implement server-side gRPC call to Penumbra node
    // For now, return empty async iterable to prevent errors
    return {
      async *[Symbol.asyncIterator]() {
        // Return empty - no balances found
      },
    };
  }

  /**
   * Fetches the current community pool supply for Penumbra (upenumbra)
   * @returns The total amount of upenumbra in the community pool
   *
   * Note: Currently returns mock data. Implement proper server-side connection.
   */
  async getCommunityPoolSupply(assetIds: AssetId[]): Promise<number> {
    // TODO: Replace with actual server-side gRPC call to Penumbra node
    // For now, return a reasonable mock value (1% of total supply as community pool)
    // This should be replaced with real data once server-side connectivity is implemented
    return 10000000000; // Mock: 10B upenumbra (approximately 10 PEN if 1 PEN = 1e9 upenumbra)
  }
}
