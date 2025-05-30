import { AssetId } from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import { ViewService } from '@penumbra-zone/protobuf';
import { 
  CommunityPoolAssetBalancesRequest,
  CommunityPoolAssetBalancesResponse 
} from '@penumbra-zone/protobuf/penumbra/core/component/community_pool/v1/community_pool_pb';

import { penumbra } from '../../../penumbra/client';
import { QueryService } from '@penumbra-zone/protobuf/penumbra/core/component/community_pool/v1/community_pool_connect';

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
 */
export class CommunityPoolService {
  constructor() {
    // penumbra service instance is imported and ready to use
  }

  getCommunityPoolAssetBalances(assetIds: AssetId[]): AsyncIterable<CommunityPoolAssetBalancesResponse> {
    const request = new CommunityPoolAssetBalancesRequest();
    request.assetIds.push(...assetIds);
    return penumbra
      .service(QueryService)
      .communityPoolAssetBalances(request);
  }

  /**
   * Fetches the current community pool supply for Penumbra (upenumbra)
   * @returns The total amount of upenumbra in the community pool
   */
  async getCommunityPoolSupply(assetIds: AssetId[]): Promise<number> {
    const responseIterable = this.getCommunityPoolAssetBalances(assetIds);
    
    let balance = 0;
    for await (const response of responseIterable) {
      balance += Number(response.balance?.amount?.lo || 0);
    }

    return balance;
  }
}