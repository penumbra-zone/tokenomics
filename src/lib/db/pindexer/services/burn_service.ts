import { Kysely, sql } from "kysely";

import {
  DATA_SOURCES,
  DB_CONFIG,
  DB_ERROR_MESSAGES,
  FIELD_TRANSFORMERS,
} from "../database-mappings";
import { DB } from "../schema";
import type { BurnSourcesData, HistoricalBurnEntryRaw } from "../types";

// Assuming these types are in types.ts
// blockService will be used by the caller (e.g., PindexerConnection or a higher-level orchestrator)
// to get timestamps if needed, to keep this service focused on burn data.

// Define an interface for the raw row structure from getHistoricalBurnEntriesRaw
interface RawBurnEntryRow {
  height: number | string | null;
  fees: number | string | null;
  dexArb: number | string | null;
  auctionBurns: number | string | null;
  dexBurns: number | string | null;
}

export class BurnService {
  private db: Kysely<DB>;

  constructor(dbInstance: Kysely<DB>) {
    this.db = dbInstance;
  }

  /**
   * Fetches the latest burn source components from supply_total_unstaked.
   * These are interpreted as fees burned, dex arbitrage burned, etc.
   */
  async getLatestBurnSources(): Promise<BurnSourcesData | null> {
    try {
      const result = await this.db
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name)
        .select([
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.FEE_BURNS,
          `${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.ARBITRAGE_BURNS} as dexArb`,
          `${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.AUCTION_LOCKED} as auctionBurns`,
          `${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.DEX_LIQUIDITY} as dexBurns`,
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT,
        ])
        .orderBy(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT, "desc")
        .limit(1)
        .executeTakeFirst();

      if (!result) return null;

      return {
        fees: FIELD_TRANSFORMERS.toTokenAmount(result.fees),
        dexArb: FIELD_TRANSFORMERS.toTokenAmount(result.dexArb),
        auctionBurns: FIELD_TRANSFORMERS.toTokenAmount(result.auctionBurns),
        dexBurns: FIELD_TRANSFORMERS.toTokenAmount(result.dexBurns),
      };
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }
  
  /**
   * Calculates cumulative total burns across all categories from start up to a specific height.
   * This aggregates DEX burns, auction burns, arbitrage burns, and fee burns.
   * @param height The block height up to which to calculate cumulative burns
   */
  async getTotalBurnsByHeight(height: string): Promise<{
    totalArbitrageBurns: number;
    totalFeeBurns: number;
    totalAuctionBurns: number;
    totalDexBurns: number;
  }> {
    try {
      if (!height || Number(height) < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const result = await this.db
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name)
        .select([
          // Sum all burn mechanisms up to the specified height with explicit casting
          sql<number>`SUM(${sql.ref(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.ARBITRAGE_BURNS)})`.as("total_arbitrage_burns"),
          sql<number>`SUM(${sql.ref(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.FEE_BURNS)})`.as("total_fee_burns"),
          sql<number>`SUM(${sql.ref(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.AUCTION_LOCKED)})`.as("total_auction_burns"),
          sql<number>`SUM(${sql.ref(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.DEX_LIQUIDITY)})`.as("total_dex_burns"),
        ])
        .where(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT, "<=", height)
        .executeTakeFirstOrThrow();

      // Return raw aggregated values for each burn category
      return {
        totalArbitrageBurns: FIELD_TRANSFORMERS.toTokenAmount(result.total_arbitrage_burns),
        totalFeeBurns: FIELD_TRANSFORMERS.toTokenAmount(result.total_fee_burns),
        totalAuctionBurns: FIELD_TRANSFORMERS.toTokenAmount(result.total_auction_burns),
        totalDexBurns: -FIELD_TRANSFORMERS.toTokenAmount(result.total_dex_burns),
      };
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches the last N historical burn entries (raw data) from supply_total_unstaked.
   * The rate calculation and timestamp association will be handled by the caller.
   * @param limit The number of historical entries to fetch.
   */
  async getHistoricalBurnEntriesRaw(
    limit: number = DB_CONFIG.DEFAULT_HISTORY_LIMIT
  ): Promise<HistoricalBurnEntryRaw[]> {
    try {
      // Validate limit
      const validLimit = Math.min(Math.max(1, limit), DB_CONFIG.MAX_HISTORY_LIMIT);

      const results = await this.db
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name)
        .select([
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT,
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.FEE_BURNS,
          `${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.ARBITRAGE_BURNS} as dexArb`,
          `${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.AUCTION_LOCKED} as auctionBurns`,
          `${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.DEX_LIQUIDITY} as dexBurns`,
        ])
        .orderBy(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT, "desc")
        .limit(validLimit)
        .execute();

      return results.map((row: RawBurnEntryRow) => ({
        height: row.height ? String(row.height) : '',
        fees: FIELD_TRANSFORMERS.toTokenAmount(row.fees),
        dexArb: FIELD_TRANSFORMERS.toTokenAmount(row.dexArb),
        auctionBurns: FIELD_TRANSFORMERS.toTokenAmount(row.auctionBurns),
        dexBurns: FIELD_TRANSFORMERS.toTokenAmount(row.dexBurns),
      }));
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches burn metrics over time with timestamps for time series analysis.
   * @param startDate The start date for the range
   * @param limit Maximum number of entries to return
   */
  async getBurnMetricsTimeSeries(
    startDate: Date,
    limit: number = DB_CONFIG.DEFAULT_HISTORY_LIMIT
  ): Promise<
    Array<{
      height: number;
      arbitrageBurns: number;
      feeBurns: number;
      totalBurns: number;
      timestamp: Date;
    }>
  > {
    try {
      const validLimit = Math.min(Math.max(1, limit), DB_CONFIG.MAX_HISTORY_LIMIT);

      const results = await this.db
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name)
        .innerJoin(
          DATA_SOURCES.BLOCK_DETAILS.name,
          `${DATA_SOURCES.BLOCK_DETAILS.name}.${DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT}`,
          `${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name}.${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT}`
        )
        .select([
          `${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name}.${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT}`,
          `${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name}.${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.ARBITRAGE_BURNS}`,
          `${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name}.${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.FEE_BURNS}`,
          `${DATA_SOURCES.BLOCK_DETAILS.name}.${DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP}`,
        ])
        .where(
          `${DATA_SOURCES.BLOCK_DETAILS.name}.${DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP}`,
          ">=",
          startDate
        )
        .orderBy(
          `${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name}.${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT}`,
          "asc"
        )
        .limit(validLimit)
        .execute();

      return results.map((row) => ({
        height: FIELD_TRANSFORMERS.toTokenAmount(row.height),
        arbitrageBurns: FIELD_TRANSFORMERS.toTokenAmount(row.arb),
        feeBurns: FIELD_TRANSFORMERS.toTokenAmount(row.fees),
        totalBurns:
          FIELD_TRANSFORMERS.toTokenAmount(row.arb) + FIELD_TRANSFORMERS.toTokenAmount(row.fees),
        timestamp: FIELD_TRANSFORMERS.toTimestamp(row.timestamp) || new Date(),
      }));
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }
}
