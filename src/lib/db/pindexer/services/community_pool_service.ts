import { createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { AssetId } from "@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb";
import { QueryService as CommunityPoolQueryService } from "@penumbra-zone/protobuf/penumbra/core/component/community_pool/v1/community_pool_connect";
import {
  CommunityPoolAssetBalancesRequest,
  CommunityPoolAssetBalancesResponse,
} from "@penumbra-zone/protobuf/penumbra/core/component/community_pool/v1/community_pool_pb";

export class CommunityPoolService {
  private client: ReturnType<typeof createClient<typeof CommunityPoolQueryService>>;

  constructor() {
    const transport = createGrpcWebTransport({
      baseUrl: "https://penumbra.grpc.ghostinnet.com/",
    });
    this.client = createClient<typeof CommunityPoolQueryService>(
      CommunityPoolQueryService,
      transport
    );
  }

  async getCommunityPoolAssetBalances(
    assetIds: AssetId[]
  ): Promise<CommunityPoolAssetBalancesResponse[]> {
    try {
      const request = new CommunityPoolAssetBalancesRequest({
        assetIds: assetIds,
      });
      const balances: CommunityPoolAssetBalancesResponse[] = [];

      // The service returns a server stream, so we need to iterate through it
      for await (const response of this.client.communityPoolAssetBalances(request)) {
        balances.push(response);
      }

      return balances;
    } catch (error) {
      console.error("Failed to fetch community pool balances:", error);
      throw error;
    }
  }

  /**
   * Fetches the current community pool supply for Penumbra (upenumbra)
   * @returns The total amount of upenumbra in the community pool
   */
  async getCommunityPoolSupply(assetIds: AssetId[]): Promise<number> {
    try {
      const balances = await this.getCommunityPoolAssetBalances(assetIds);
      // Sum up all balances
      return balances.reduce((total, balance) => {
        const amount = Number(balance.balance?.amount?.lo || 0);
        return total + amount;
      }, 0);
    } catch (error) {
      console.error("Failed to fetch community pool supply:", error);
      throw error;
    }
  }
}
