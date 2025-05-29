import { Kysely, sql } from "kysely";

import { DATA_SOURCES, DB_ERROR_MESSAGES, FIELD_TRANSFORMERS } from "../database-mappings";
import { DB } from "../schema";
import type { DelegatedSupplyComponent, UnstakedSupplyComponents, DurationWindow } from "../types";
import { getDateGroupExpression } from "../../utils";

// Define an interface for the raw row structure from getDelegatedSupplyComponentsByHeight
interface RawDelegatedSupplyRow {
  um: number | string | null;
  del_um: number | string | null;
  rate_bps2: number | string | null;
  validator_id?: number | string | null;
}

export class SupplyService {
  private db: Kysely<DB>;

  constructor(dbInstance: Kysely<DB>) {
    this.db = dbInstance;
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
        um: FIELD_TRANSFORMERS.toTokenAmount(result.um),
        auction: FIELD_TRANSFORMERS.toTokenAmount(result.auction),
        dex: FIELD_TRANSFORMERS.toTokenAmount(result.dex),
        arb: FIELD_TRANSFORMERS.toTokenAmount(result.arb),
        fees: FIELD_TRANSFORMERS.toTokenAmount(result.fees),
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
      const query = await this.db
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

      return query.executeTakeFirstOrThrow();
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
    window: DurationWindow = '1d'
  ): Promise<
    Array<{
      height: number;
      total: number;
      staked: number;
      timestamp: Date;
    }>
  > {
    try {
      // For SQLite compatibility, we'll use a different approach
      // Group by date intervals and take the latest value from each group
      const results = await this.db
        .selectFrom(DATA_SOURCES.INSIGHTS_SUPPLY.name)
        .innerJoin(
          DATA_SOURCES.BLOCK_DETAILS.name,
          `${DATA_SOURCES.BLOCK_DETAILS.name}.${DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT}`,
          `${DATA_SOURCES.INSIGHTS_SUPPLY.name}.${DATA_SOURCES.INSIGHTS_SUPPLY.fields.HEIGHT}`
        )
        .select([
          sql<string>`MAX(${sql.ref(`${DATA_SOURCES.INSIGHTS_SUPPLY.name}.${DATA_SOURCES.INSIGHTS_SUPPLY.fields.HEIGHT}`)})`.as('height'),
          sql<string>`MAX(${sql.ref(`${DATA_SOURCES.INSIGHTS_SUPPLY.name}.${DATA_SOURCES.INSIGHTS_SUPPLY.fields.TOTAL_SUPPLY}`)})`.as('total'),
          sql<string>`MAX(${sql.ref(`${DATA_SOURCES.INSIGHTS_SUPPLY.name}.${DATA_SOURCES.INSIGHTS_SUPPLY.fields.STAKED_SUPPLY}`)})`.as('staked'),
          sql<Date>`MAX(${sql.ref(`${DATA_SOURCES.BLOCK_DETAILS.name}.${DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP}`)})`.as('timestamp'),
          getDateGroupExpression(window, `${DATA_SOURCES.BLOCK_DETAILS.name}.${DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP}`).as('date_group'),
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
        .groupBy('date_group')
        .orderBy('date_group', 'asc')
        .execute();

      return results.map((row) => ({
        height: FIELD_TRANSFORMERS.toTokenAmount(row.height),
        total: FIELD_TRANSFORMERS.toTokenAmount(row.total),
        staked: FIELD_TRANSFORMERS.toTokenAmount(row.staked),
        timestamp: FIELD_TRANSFORMERS.toTimestamp(row.timestamp) || new Date(),
      }));
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }
}
