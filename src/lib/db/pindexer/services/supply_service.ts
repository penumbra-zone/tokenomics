import { createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { AssetId } from "@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb";
import { QueryService as CommunityPoolQueryService } from "@penumbra-zone/protobuf/penumbra/core/component/community_pool/v1/community_pool_connect";
import {
  CommunityPoolAssetBalancesRequest,
  CommunityPoolAssetBalancesResponse,
} from "@penumbra-zone/protobuf/penumbra/core/component/community_pool/v1/community_pool_pb";
import { Kysely, sql } from "kysely";

import { getDateGroupExpression } from "../../utils";
import { DATA_SOURCES, DB_ERROR_MESSAGES, FIELD_TRANSFORMERS } from "../database-mappings";
import { DB } from "../schema";
import type { DurationWindow, UnstakedSupplyComponents } from "../types";
import { AssetMetadataMap, BaseService } from "./base_service";
export class SupplyService extends BaseService {
  private client: ReturnType<typeof createClient<typeof CommunityPoolQueryService>>;

  constructor(dbInstance: Kysely<DB>, metadataMap: AssetMetadataMap) {
    super(dbInstance, metadataMap);
    const transport = createGrpcWebTransport({
      baseUrl: "https://penumbra.grpc.ghostinnet.com/",
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    });
    this.client = createClient<typeof CommunityPoolQueryService>(
      CommunityPoolQueryService,
      transport
    );
  }

  /**
   * Fetches the latest unstaked supply components from supply_total_unstaked.
   */
  async getLatestUnstakedSupplyComponents(): Promise<UnstakedSupplyComponents | null> {
    try {
      const result = await this.db
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name)
        .select([
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.CIRCULATING,
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.AUCTION_LOCKED,
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.DEX_LIQUIDITY,
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.ARBITRAGE_BURNS,
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.FEE_BURNS,
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT,
        ])
        .orderBy(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT, "desc")
        .limit(1)
        .executeTakeFirst();

      if (!result) return null;

      return {
        um: this.formatAmount(result.um, "um"),
        auction: this.formatAmount(result.auction, "um"),
        dex: this.formatAmount(result.dex, "um"),
        arb: this.formatAmount(result.arb, "um"),
        fees: this.formatAmount(Math.abs(Number(result.fees)), "um"),
      };
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  async getInsightsSupply(blockHeight: string): Promise<{
    totalSupply: string;
    stakedSupply: string;
    marketCap: number | null;
    price: number | null;
    height: string;
  }> {
    try {
      const query = this.db
        .selectFrom(DATA_SOURCES.INSIGHTS_SUPPLY.name)
        .select([
          `${DATA_SOURCES.INSIGHTS_SUPPLY.fields.TOTAL_SUPPLY} as totalSupply`,
          `${DATA_SOURCES.INSIGHTS_SUPPLY.fields.STAKED_SUPPLY} as stakedSupply`,
          `${DATA_SOURCES.INSIGHTS_SUPPLY.fields.MARKET_CAP} as marketCap`,
          `${DATA_SOURCES.INSIGHTS_SUPPLY.fields.PRICE} as price`,
          `${DATA_SOURCES.INSIGHTS_SUPPLY.fields.HEIGHT} as height`,
        ])
        .where(DATA_SOURCES.INSIGHTS_SUPPLY.fields.HEIGHT, "=", blockHeight)
        .limit(1);

      const { totalSupply, stakedSupply, marketCap, price, height } =
        await query.executeTakeFirstOrThrow();

      return {
        totalSupply: this.formatAmount(totalSupply, "um"),
        stakedSupply: this.formatAmount(stakedSupply, "um"),
        marketCap: marketCap ? Number(this.formatAmount(marketCap, "um")) : null,
        price,
        height,
      };
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches historical supply data for a time range grouped by duration window.
   * @param startDate The start date for the range
   * @param endDate The end date for the range
   * @param window The duration window for grouping (e.g., '1d', '1w')
   */
  async getHistoricalSupplyData(
    startDate: Date,
    endDate: Date,
    window: DurationWindow = "1d"
  ): Promise<
    Array<{
      height: number;
      total: number;
      staked: number;
      timestamp: Date;
    }>
  > {
    try {
      const results = await this.db
        .selectFrom(DATA_SOURCES.INSIGHTS_SUPPLY.name)
        .innerJoin(
          DATA_SOURCES.BLOCK_DETAILS.name,
          `${DATA_SOURCES.BLOCK_DETAILS.name}.${DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT}`,
          `${DATA_SOURCES.INSIGHTS_SUPPLY.name}.${DATA_SOURCES.INSIGHTS_SUPPLY.fields.HEIGHT}`
        )
        .select([
          sql<string>`MAX(${sql.ref(`${DATA_SOURCES.INSIGHTS_SUPPLY.name}.${DATA_SOURCES.INSIGHTS_SUPPLY.fields.HEIGHT}`)})`.as(
            "height"
          ),
          sql<string>`MAX(${sql.ref(`${DATA_SOURCES.INSIGHTS_SUPPLY.name}.${DATA_SOURCES.INSIGHTS_SUPPLY.fields.TOTAL_SUPPLY}`)})`.as(
            "total"
          ),
          sql<string>`MAX(${sql.ref(`${DATA_SOURCES.INSIGHTS_SUPPLY.name}.${DATA_SOURCES.INSIGHTS_SUPPLY.fields.STAKED_SUPPLY}`)})`.as(
            "staked"
          ),
          sql<Date>`MAX(${sql.ref(`${DATA_SOURCES.BLOCK_DETAILS.name}.${DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP}`)})`.as(
            "timestamp"
          ),
          getDateGroupExpression(
            window,
            `${DATA_SOURCES.BLOCK_DETAILS.name}.${DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP}`
          ).as("date_group"),
        ])
        .where(
          `${DATA_SOURCES.BLOCK_DETAILS.name}.${DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP}`,
          ">=",
          startDate
        )
        .where(
          `${DATA_SOURCES.BLOCK_DETAILS.name}.${DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP}`,
          "<=",
          endDate
        )
        .groupBy("date_group")
        .orderBy("date_group", "asc")
        .execute();

      return results.map((row) => ({
        height: FIELD_TRANSFORMERS.toTokenAmount(row.height),
        total: Number(this.formatAmount(row.total, "um")),
        staked: Number(this.formatAmount(row.staked, "um")),
        timestamp: FIELD_TRANSFORMERS.toTimestamp(row.timestamp) || new Date(),
      }));
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
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
   * @returns The total amount of upenumbra in the community pool, formatted as a string.
   */
  async getCommunityPoolSupply(assetIds: AssetId[]): Promise<string> {
    try {
      const balances = await this.getCommunityPoolAssetBalances(assetIds);
      // Sum up all balances
      const total = balances.reduce((total, balance) => {
        return total + BigInt(balance.balance?.amount?.lo ?? 0);
      }, BigInt(0));

      return this.formatAmount(total, "um");
    } catch (error) {
      console.error("Failed to fetch community pool supply:", error);
      throw error;
    }
  }
}
