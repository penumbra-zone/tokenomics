import { Kysely, sql } from "kysely";
import { formatAssetAmount } from "@/lib/registry/utils";
import { getUmAssetMetadata, getUSDCAssetMetadata } from "@/lib/registry/utils";
import { Metadata } from "@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb";

import { getDateGroupExpression } from "../../utils";
import { DATA_SOURCES, DB_ERROR_MESSAGES, FIELD_TRANSFORMERS } from "../database-mappings";
import { DB } from "../schema";
import type { DurationWindow, UnstakedSupplyComponents } from "../types";

interface AssetMetadataMap {
  um: Metadata;
  usdc: Metadata;
}

// Define an interface for the raw row structure from getDelegatedSupplyComponentsByHeight
interface RawDelegatedSupplyRow {
  um: number | string | null;
  del_um: number | string | null;
  rate_bps2: number | string | null;
  validator_id?: number | string | null;
}

export class SupplyService {
  private db: Kysely<DB>;
  private metadataMap: AssetMetadataMap | null = null;

  constructor(dbInstance: Kysely<DB>) {
    this.db = dbInstance;
    this.initializeMetadata();
  }

  private async initializeMetadata() {
    const [umMetadata, usdcMetadata] = await Promise.all([
      getUmAssetMetadata(),
      getUSDCAssetMetadata(),
    ]);

    if (!umMetadata || !usdcMetadata) {
      throw new Error("Failed to initialize asset metadata");
    }

    this.metadataMap = {
      um: umMetadata,
      usdc: usdcMetadata,
    };
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

      const result = await query.executeTakeFirstOrThrow();

      return {
        ...result,
        totalSupply: this.formatAmount(result.totalSupply, "um"),
        stakedSupply: this.formatAmount(result.stakedSupply, "um"),
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

  private formatAmount(amount: string | bigint | number, asset: keyof AssetMetadataMap): string {
    if (!this.metadataMap) {
      throw new Error("Metadata not initialized");
    }
    return formatAssetAmount(BigInt(amount), this.metadataMap[asset]);
  }
}
