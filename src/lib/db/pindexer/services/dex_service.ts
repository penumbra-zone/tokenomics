import { Kysely } from "kysely";

import { DATA_SOURCES, DB_CONFIG, DB_ERROR_MESSAGES } from "../database-mappings";
import { DB } from "../schema";
import { type DurationWindow } from "../types";

export class DexService {
  private db: Kysely<DB>;

  constructor(dbInstance: Kysely<DB>) {
    this.db = dbInstance;
  }

  async getAggregateSummary(window: DurationWindow) {
    try {
      if (!window) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_DURATION_WINDOW);
      }

      return this.db
        .selectFrom(DATA_SOURCES.DEX_EX_AGGREGATE_SUMMARY)
        .selectAll()
        .where(DATA_SOURCES.FIELDS.THE_WINDOW, "=", window)
        .executeTakeFirst();
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  async getPairsSummary(window: DurationWindow) {
    try {
      if (!window) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_DURATION_WINDOW);
      }

      return this.db
        .selectFrom(DATA_SOURCES.DEX_EX_PAIRS_SUMMARY)
        .selectAll()
        .where(DATA_SOURCES.FIELDS.THE_WINDOW, "=", window)
        .orderBy("direct_volume_indexing_denom_over_window", "desc")
        .execute();
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  async getPositionState(positionId: Buffer) {
    try {
      if (!positionId) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_POSITION_ID);
      }

      return this.db
        .selectFrom(DATA_SOURCES.DEX_EX_POSITION_STATE)
        .selectAll()
        .where(DATA_SOURCES.FIELDS.POSITION_ID, "=", positionId)
        .executeTakeFirst();
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  async getPositionExecutions(positionId: Buffer) {
    try {
      if (!positionId) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_POSITION_ID);
      }

      return this.db
        .selectFrom(DATA_SOURCES.DEX_EX_POSITION_EXECUTIONS)
        .selectAll()
        .where(DATA_SOURCES.FIELDS.POSITION_ID, "=", positionId)
        .orderBy("time", "desc")
        .execute();
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  async getPositionReserves(positionId: Buffer) {
    try {
      if (!positionId) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_POSITION_ID);
      }

      return this.db
        .selectFrom(DATA_SOURCES.DEX_EX_POSITION_RESERVES)
        .selectAll()
        .where(DATA_SOURCES.FIELDS.POSITION_ID, "=", positionId)
        .orderBy("time", "desc")
        .execute();
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  async getPositionWithdrawals(positionId: Buffer) {
    try {
      if (!positionId) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_POSITION_ID);
      }

      return this.db
        .selectFrom(DATA_SOURCES.DEX_EX_POSITION_WITHDRAWALS)
        .selectAll()
        .where(DATA_SOURCES.FIELDS.POSITION_ID, "=", positionId)
        .orderBy("time", "desc")
        .execute();
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  async getBlockSummary(height: number) {
    try {
      if (!height || height < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      return this.db
        .selectFrom(DATA_SOURCES.DEX_EX_BLOCK_SUMMARY)
        .selectAll()
        .where(DATA_SOURCES.FIELDS.HEIGHT, "=", height)
        .executeTakeFirst();
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  async getTransaction(txHash: Buffer) {
    try {
      if (!txHash) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_DATA);
      }

      return this.db
        .selectFrom(DATA_SOURCES.DEX_EX_TRANSACTIONS)
        .selectAll()
        .where("transaction_id", "=", txHash)
        .executeTakeFirst();
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches price charts data for a specific asset pair and time window.
   * @param assetStart The starting asset ID
   * @param assetEnd The ending asset ID
   * @param window The duration window
   */
  async getPriceCharts(assetStart: Buffer, assetEnd: Buffer, window: DurationWindow) {
    try {
      if (!assetStart || !assetEnd || !window) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_DATA);
      }

      return this.db
        .selectFrom(DATA_SOURCES.DEX_EX_PRICE_CHARTS)
        .selectAll()
        .where(DATA_SOURCES.FIELDS.ASSET_START, "=", assetStart)
        .where(DATA_SOURCES.FIELDS.ASSET_END, "=", assetEnd)
        .where(DATA_SOURCES.FIELDS.THE_WINDOW, "=", window)
        .orderBy(DATA_SOURCES.FIELDS.START_TIME, "asc")
        .execute();
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches recent price charts data for a time range.
   * @param startTime The start time for the range
   * @param limit Maximum number of entries to return
   */
  async getRecentPriceCharts(startTime: Date, limit: number = DB_CONFIG.DEFAULT_HISTORY_LIMIT) {
    try {
      const validLimit = Math.min(Math.max(1, limit), DB_CONFIG.MAX_HISTORY_LIMIT);

      return this.db
        .selectFrom(DATA_SOURCES.DEX_EX_PRICE_CHARTS)
        .selectAll()
        .where(DATA_SOURCES.FIELDS.START_TIME, ">=", startTime)
        .orderBy(DATA_SOURCES.FIELDS.START_TIME, "desc")
        .limit(validLimit)
        .execute();
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }
}
