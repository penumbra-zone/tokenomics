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

  /**
   * Fetches delegated supply components for a given block height.
   * @param height The block height to fetch delegated supply for.
   */
  async getDelegatedSupplyComponentsByHeight(height: string): Promise<DelegatedSupplyComponent[]> {
    try {
      if (!height || Number(height) < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const results = await this.db
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_STAKED.name)
        .select([
          DATA_SOURCES.SUPPLY_TOTAL_STAKED.fields.STAKED_UM,
          DATA_SOURCES.SUPPLY_TOTAL_STAKED.fields.DELEGATED_UM,
          DATA_SOURCES.SUPPLY_TOTAL_STAKED.fields.RATE_BPS2,
          DATA_SOURCES.SUPPLY_TOTAL_STAKED.fields.VALIDATOR_ID,
        ])
        .where(DATA_SOURCES.SUPPLY_TOTAL_STAKED.fields.HEIGHT, "=", String(height))
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
  async getHistoricalUnstakedSupplySumByHeight(height: string): Promise<number | null> {
    try {
      if (!height || Number(height) < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const result = await this.db
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name)
        .select(
          sql<number>`(${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.CIRCULATING} + ${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.AUCTION_LOCKED} + ${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.DEX_LIQUIDITY} + ${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.ARBITRAGE_BURNS} + ${DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.FEE_BURNS})`.as(
            "total_unstaked"
          )
        )
        .where(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT, "=", String(height))
        .executeTakeFirst();

      return result?.total_unstaked ?? null;
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
   * Fetches the total supply from the insights_supply table for a specific block height.
   * @param height The block height.
   */
  async getHistoricalTotalSupplyFromInsights(height: string): Promise<number | null> {
    try {
      if (!height || Number(height) < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const result = await this.db
        .selectFrom(DATA_SOURCES.INSIGHTS_SUPPLY.name)
        .select([`${DATA_SOURCES.INSIGHTS_SUPPLY.fields.TOTAL_SUPPLY} as totalSupply`])
        .where(DATA_SOURCES.INSIGHTS_SUPPLY.fields.HEIGHT, "=", String(height))
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
        .selectFrom(DATA_SOURCES.INSIGHTS_SUPPLY.name)
        .innerJoin(
          DATA_SOURCES.BLOCK_DETAILS.name,
          `${DATA_SOURCES.BLOCK_DETAILS.name}.${DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT}`,
          `${DATA_SOURCES.INSIGHTS_SUPPLY.name}.${DATA_SOURCES.INSIGHTS_SUPPLY.fields.HEIGHT}`
        )
        .select([
          `${DATA_SOURCES.INSIGHTS_SUPPLY.name}.${DATA_SOURCES.INSIGHTS_SUPPLY.fields.HEIGHT}`,
          `${DATA_SOURCES.INSIGHTS_SUPPLY.name}.${DATA_SOURCES.INSIGHTS_SUPPLY.fields.TOTAL_SUPPLY}`,
          `${DATA_SOURCES.INSIGHTS_SUPPLY.name}.${DATA_SOURCES.INSIGHTS_SUPPLY.fields.STAKED_SUPPLY}`,
          `${DATA_SOURCES.BLOCK_DETAILS.name}.${DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP}`,
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
        .orderBy(
          `${DATA_SOURCES.INSIGHTS_SUPPLY.name}.${DATA_SOURCES.INSIGHTS_SUPPLY.fields.HEIGHT}`,
          "asc"
        )
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
