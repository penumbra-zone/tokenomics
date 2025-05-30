import { Kysely, sql } from "kysely";

import { calculateTotalBurned } from "@/lib/calculations";
import { getDateGroupExpression } from "../../utils";
import { DATA_SOURCES, DB_ERROR_MESSAGES, FIELD_TRANSFORMERS } from "../database-mappings";
import { DB } from "../schema";
import type { BurnDataBySource, DurationWindow } from "../types";

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
          sql<number>`SUM(${sql.ref(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.ARBITRAGE_BURNS)})`.as(
            "total_arbitrage_burns"
          ),
          sql<number>`SUM(${sql.ref(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.FEE_BURNS)})`.as(
            "total_fee_burns"
          ),
        ])
        .where(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT, "<=", height)
        .executeTakeFirstOrThrow();

      // Return raw aggregated values for burned categories only
      const totalArbitrageBurns = FIELD_TRANSFORMERS.toTokenAmount(result.total_arbitrage_burns);
      const totalFeeBurns = FIELD_TRANSFORMERS.toTokenAmount(result.total_fee_burns);

      return {
        totalArbitrageBurns,
        totalFeeBurns,
        totalBurned: calculateTotalBurned(totalArbitrageBurns, totalFeeBurns),
      };
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches historical burn entries from supply_total_unstaked.
   */
  async getBurnDataBySource(): Promise<BurnDataBySource> {
    try {
      const arbitrageSumSQL = sql<number>`SUM(${sql.ref(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.ARBITRAGE_BURNS)})`;
      const feeSumSQL = sql<number>`SUM(${sql.ref(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.FEE_BURNS)})`;
      const dexSumSQL = sql<number>`SUM(${sql.ref(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.DEX_LIQUIDITY)})`;
      const auctionSumSQL = sql<number>`SUM(${sql.ref(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.AUCTION_LOCKED)})`;

      const results = await this.db
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name)
        .select([
          arbitrageSumSQL.as("arbitrage_burns"),
          feeSumSQL.as("fee_burns"),
          dexSumSQL.as("dex_locked"),
          auctionSumSQL.as("auction_locked"),
        ])
        .executeTakeFirstOrThrow();

      const arbitrageBurns = FIELD_TRANSFORMERS.toTokenAmount(results.arbitrage_burns);
      const feeBurns = FIELD_TRANSFORMERS.toTokenAmount(results.fee_burns);
      const dexLocked = FIELD_TRANSFORMERS.toTokenAmount(Math.abs(results.dex_locked));
      const auctionLocked = FIELD_TRANSFORMERS.toTokenAmount(results.auction_locked);

      return {
        arbitrageBurns,
        feeBurns,
        dexLocked,
        auctionLocked,
      };
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches burn metrics over time with timestamps for time series analysis, grouped by duration window.
   * @param startDate The start date for the range
   * @param endDate The end date for the range
   * @param window The duration window for grouping (e.g., '1d', '1w')
   */
  async getBurnMetricsTimeSeries(
    startDate: Date,
    endDate: Date,
    window: DurationWindow = "1d"
  ): Promise<
    Array<{
      arbitrageBurns: number;
      feeBurns: number;
      timestamp: Date;
    }>
  > {
    try {
      const results = await this.db
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name)
        .innerJoin(
          DATA_SOURCES.BLOCK_DETAILS.name,
          `${DATA_SOURCES.BLOCK_DETAILS.name}.${DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT}`,
          `${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name}.${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT}`
        )
        .select([
          sql<string>`MAX(${sql.ref(`${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name}.${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT}`)})`.as(
            "height"
          ),
          sql<string>`MAX(${sql.ref(`${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name}.${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.ARBITRAGE_BURNS}`)})`.as(
            "arbitrage_burns"
          ),
          sql<string>`MAX(${sql.ref(`${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name}.${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.FEE_BURNS}`)})`.as(
            "fee_burns"
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
        arbitrageBurns: FIELD_TRANSFORMERS.toTokenAmount(row.arbitrage_burns),
        feeBurns: FIELD_TRANSFORMERS.toTokenAmount(row.fee_burns),
        timestamp: FIELD_TRANSFORMERS.toTimestamp(row.timestamp) || new Date(),
      }));
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }
}
