import { Kysely, sql } from "kysely";

import { DATA_SOURCES, DB_ERROR_MESSAGES, FIELD_TRANSFORMERS } from "../database-mappings";
import { DB } from "../schema";
import type { DelegatedSupplyComponent, UnstakedSupplyComponents } from "../types";

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
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED)
        .select([
          DATA_SOURCES.FIELDS.CIRCULATING,
          DATA_SOURCES.FIELDS.AUCTION_LOCKED,
          DATA_SOURCES.FIELDS.DEX_LIQUIDITY,
          DATA_SOURCES.FIELDS.ARBITRAGE_BURNS,
          DATA_SOURCES.FIELDS.FEE_BURNS,
          DATA_SOURCES.FIELDS.HEIGHT,
        ])
        .orderBy(DATA_SOURCES.FIELDS.HEIGHT, "desc")
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

  /**
   * Fetches delegated supply components for a given block height.
   * @param height The block height to fetch delegated supply for.
   */
  async getDelegatedSupplyComponentsByHeight(height: number): Promise<DelegatedSupplyComponent[]> {
    try {
      if (!height || height < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const results = await this.db
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_STAKED)
        .select([
          DATA_SOURCES.FIELDS.STAKED_UM,
          DATA_SOURCES.FIELDS.DELEGATED_UM,
          DATA_SOURCES.FIELDS.RATE_BPS2,
          DATA_SOURCES.FIELDS.VALIDATOR_ID,
        ])
        .where(DATA_SOURCES.FIELDS.HEIGHT, "=", String(height))
        .execute();

      return results.map((row: RawDelegatedSupplyRow) => ({
        um: FIELD_TRANSFORMERS.toTokenAmount(row.um),
        del_um: FIELD_TRANSFORMERS.toTokenAmount(row.del_um),
        rate_bps2: FIELD_TRANSFORMERS.toTokenAmount(row.rate_bps2),
      }));
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches the sum of unstaked supply components (um, auction, dex, arb, fees)
   * from supply_total_unstaked at a specific block height.
   * @param height The block height.
   */
  async getHistoricalUnstakedSupplySumByHeight(height: number): Promise<number | null> {
    try {
      if (!height || height < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const result = await this.db
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED)
        .select(
          sql<number>`(${DATA_SOURCES.FIELDS.CIRCULATING} + ${DATA_SOURCES.FIELDS.AUCTION_LOCKED} + ${DATA_SOURCES.FIELDS.DEX_LIQUIDITY} + ${DATA_SOURCES.FIELDS.ARBITRAGE_BURNS} + ${DATA_SOURCES.FIELDS.FEE_BURNS})`.as(
            "total_unstaked"
          )
        )
        .where(DATA_SOURCES.FIELDS.HEIGHT, "=", String(height))
        .executeTakeFirst();

      return result?.total_unstaked ?? null;
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches the total supply from the insights_supply table for a specific block height.
   * @param height The block height.
   */
  async getHistoricalTotalSupplyFromInsights(height: number): Promise<number | null> {
    try {
      if (!height || height < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const result = await this.db
        .selectFrom(DATA_SOURCES.INSIGHTS_SUPPLY)
        .select([`${DATA_SOURCES.FIELDS.TOTAL_SUPPLY} as totalSupply`])
        .where(DATA_SOURCES.FIELDS.HEIGHT, "=", String(height))
        .executeTakeFirst();

      return result?.totalSupply ? FIELD_TRANSFORMERS.toTokenAmount(result.totalSupply) : null;
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches historical supply data for a time range using raw SQL for better performance.
   * @param startDate The start date for the range
   * @param endDate The end date for the range
   */
  async getHistoricalSupplyData(
    startDate: Date,
    endDate: Date
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
        .selectFrom(DATA_SOURCES.INSIGHTS_SUPPLY)
        .innerJoin(
          DATA_SOURCES.BLOCK_DETAILS,
          `${DATA_SOURCES.BLOCK_DETAILS}.${DATA_SOURCES.FIELDS.HEIGHT}`,
          `${DATA_SOURCES.INSIGHTS_SUPPLY}.${DATA_SOURCES.FIELDS.HEIGHT}`
        )
        .select([
          `${DATA_SOURCES.INSIGHTS_SUPPLY}.${DATA_SOURCES.FIELDS.HEIGHT}`,
          `${DATA_SOURCES.INSIGHTS_SUPPLY}.${DATA_SOURCES.FIELDS.TOTAL_SUPPLY}`,
          `${DATA_SOURCES.INSIGHTS_SUPPLY}.${DATA_SOURCES.FIELDS.STAKED_SUPPLY}`,
          `${DATA_SOURCES.BLOCK_DETAILS}.${DATA_SOURCES.FIELDS.TIMESTAMP}`,
        ])
        .where(`${DATA_SOURCES.BLOCK_DETAILS}.${DATA_SOURCES.FIELDS.TIMESTAMP}`, ">=", startDate)
        .where(`${DATA_SOURCES.BLOCK_DETAILS}.${DATA_SOURCES.FIELDS.TIMESTAMP}`, "<=", endDate)
        .orderBy(`${DATA_SOURCES.INSIGHTS_SUPPLY}.${DATA_SOURCES.FIELDS.HEIGHT}`, "asc")
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
