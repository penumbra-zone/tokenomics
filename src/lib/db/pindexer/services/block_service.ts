import type { Selectable } from "kysely";
import { Kysely } from "kysely";

import {
  DATA_SOURCES,
  DB_CONFIG,
  DB_ERROR_MESSAGES,
  FIELD_TRANSFORMERS,
} from "../database-mappings";
import type { BlockDetails } from "../schema";
import { DB } from "../schema";

const TABLE = DATA_SOURCES.BLOCK_DETAILS;

export class BlockService {
  private db: Kysely<DB>;

  constructor(dbInstance: Kysely<DB>) {
    this.db = dbInstance;
  }

  /**
   * Fetches the latest block details from the block_details table.
   */
  async getLatestBlockDetails(): Promise<Selectable<BlockDetails>> {
    try {
      return this.db
        .selectFrom(TABLE.name)
        .selectAll()
        .orderBy(TABLE.fields.HEIGHT, "desc")
        .limit(1)
        .executeTakeFirstOrThrow();
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches the start and end block heights for a given duration window.
   */
  async getBlockRangeForDays(
    days: number
  ): Promise<{
    startBlock: { height: string; timestamp: Date };
    endBlock: { height: string; timestamp: Date };
  }> {
    try {
      if (!days || days < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get the closest block to the end date (most recent)
      const endHeightResult = await this.db
        .selectFrom(DATA_SOURCES.BLOCK_DETAILS.name)
        .selectAll()
        .where(DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP, "<=", endDate)
        .orderBy(DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP, "desc")
        .limit(1)
        .executeTakeFirstOrThrow();

      // Get the closest block to the start date
      const startHeightResult = await this.db
        .selectFrom(DATA_SOURCES.BLOCK_DETAILS.name)
        .selectAll()
        .where(DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP, "<=", startDate)
        .orderBy(DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP, "desc")
        .limit(1)
        .executeTakeFirstOrThrow();

      return {
        startBlock: startHeightResult,
        endBlock: endHeightResult,
      };
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches the timestamp for a specific block height.
   * @param height The block height.
   */
  async getBlockTimestampByHeight(height: string): Promise<Date | null> {
    try {
      if (!height || Number(height) < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const result = await this.db
        .selectFrom(TABLE.name)
        .select(TABLE.fields.TIMESTAMP)
        .where(TABLE.fields.HEIGHT, "=", String(height))
        .executeTakeFirst();

      return result ? FIELD_TRANSFORMERS.toTimestamp(result.timestamp) : null;
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches block details for a range of heights.
   * @param startHeight The starting block height
   * @param endHeight The ending block height
   */
  async getBlockDetailsRange(
    startHeight: number,
    endHeight: number
  ): Promise<
    Array<{
      height: number;
      timestamp: Date;
      root: Buffer;
    }>
  > {
    try {
      if (
        !startHeight ||
        !endHeight ||
        startHeight < 0 ||
        endHeight < 0 ||
        startHeight > endHeight
      ) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const results = await this.db
        .selectFrom(TABLE.name)
        .select([
          TABLE.fields.HEIGHT,
          TABLE.fields.TIMESTAMP,
          TABLE.fields.ROOT,
        ])
        .where(TABLE.fields.HEIGHT, ">=", String(startHeight))
        .where(TABLE.fields.HEIGHT, "<=", String(endHeight))
        .orderBy(TABLE.fields.HEIGHT, "asc")
        .execute();

      return results.map((row) => ({
        height: FIELD_TRANSFORMERS.toTokenAmount(row.height),
        timestamp: FIELD_TRANSFORMERS.toTimestamp(row.timestamp) || new Date(),
        root: row.root,
      }));
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches the latest N block details.
   * @param limit Number of blocks to fetch
   */
  async getLatestBlockDetailsHistory(limit: number = DB_CONFIG.DEFAULT_HISTORY_LIMIT): Promise<
    Array<{
      height: number;
      timestamp: Date;
      root: Buffer;
    }>
  > {
    try {
      const validLimit = Math.min(Math.max(1, limit), DB_CONFIG.MAX_HISTORY_LIMIT);

      const results = await this.db
        .selectFrom(TABLE.name)
        .select([
          TABLE.fields.HEIGHT,
          TABLE.fields.TIMESTAMP,
          TABLE.fields.ROOT,
        ])
        .orderBy(TABLE.fields.HEIGHT, "desc")
        .limit(validLimit)
        .execute();

      return results.map((row) => ({
        height: FIELD_TRANSFORMERS.toTokenAmount(row.height),
        timestamp: FIELD_TRANSFORMERS.toTimestamp(row.timestamp) || new Date(),
        root: row.root,
      }));
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }
}
