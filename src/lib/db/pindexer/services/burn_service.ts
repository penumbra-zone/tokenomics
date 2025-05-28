import { Kysely, sql } from "kysely";

import {
  DATA_SOURCES,
  DB_CONFIG,
  DB_ERROR_MESSAGES,
  FIELD_TRANSFORMERS,
} from "../database-mappings";
import { DB } from "../schema";
import type { BurnSourcesData, HistoricalBurnEntryRaw } from "../types";
import { calculateTotalBurned } from '@/lib/calculations';

// Assuming these types are in types.ts
// blockService will be used by the caller (e.g., PindexerConnection or a higher-level orchestrator)
// to get timestamps if needed, to keep this service focused on burn data.

// Define an interface for the raw row structure from getHistoricalBurnEntriesRaw
interface RawBurnEntryRow {
  height: number | string | null;
  arb: number | string | null; // arbitrage burns
  fees: number | string | null; // fee burns
}

export class BurnService {
  private db: Kysely<DB>;

  constructor(dbInstance: Kysely<DB>) {
    this.db = dbInstance;
  }

  /**
   * Calculates cumulative total burns across all categories from start up to a specific height.
   * Only includes permanently burned tokens: arbitrage burns and fee burns.
   * @param height The block height up to which to calculate cumulative burns
   */
  async getTotalBurnsByHeight(height: string): Promise<{
    totalArbitrageBurns: number;
    totalFeeBurns: number;
    totalBurned: number; // Only arb + fees
  }> {
    try {
      if (!height || Number(height) < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const result = await this.db
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name)
        .select([
          // Sum only the permanently burned mechanisms up to the specified height
          sql<number>`SUM(${sql.ref(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.ARBITRAGE_BURNS)})`.as("total_arbitrage_burns"),
          sql<number>`SUM(${sql.ref(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.FEE_BURNS)})`.as("total_fee_burns"),
        ])
        .where(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT, "<=", height)
        .executeTakeFirstOrThrow();

      // Return raw aggregated values for burned categories only
      const totalArbitrageBurns = FIELD_TRANSFORMERS.toTokenAmount(result.total_arbitrage_burns);
      const totalFeeBurns = FIELD_TRANSFORMERS.toTokenAmount(result.total_fee_burns);
      
      return {
        totalArbitrageBurns,
        totalFeeBurns,
        totalBurned: totalArbitrageBurns + totalFeeBurns, // Only actual burns
      };
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches the latest burn source components from supply_total_unstaked.
   * Only returns permanently burned tokens: arbitrage burns and fee burns.
   */
  async getLatestBurnSources(): Promise<BurnSourcesData | null> {
    try {
      const result = await this.db
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name)
        .select([
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.ARBITRAGE_BURNS,
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.FEE_BURNS,
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT,
        ])
        .orderBy(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT, "desc")
        .limit(1)
        .executeTakeFirst();

      if (!result) return null;

      const arbitrageBurns = FIELD_TRANSFORMERS.toTokenAmount(result.arb);
      const feeBurns = FIELD_TRANSFORMERS.toTokenAmount(result.fees);

      return {
        arbitrageBurns,
        feeBurns,
        totalBurned: calculateTotalBurned(arbitrageBurns, feeBurns),
      };
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches the last N historical burn entries (raw data) from supply_total_unstaked.
   * Only returns permanently burned tokens: arbitrage burns and fee burns.
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
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.ARBITRAGE_BURNS,
          DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.FEE_BURNS,
        ])
        .orderBy(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT, "desc")
        .limit(validLimit)
        .execute();

      return results.map((row: RawBurnEntryRow) => {
        const arbitrageBurns = FIELD_TRANSFORMERS.toTokenAmount(row.arb);
        const feeBurns = FIELD_TRANSFORMERS.toTokenAmount(row.fees);
        
        return {
          height: row.height ? String(row.height) : '',
          arbitrageBurns,
          feeBurns,
          totalBurned: arbitrageBurns + feeBurns,
        };
      });
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
