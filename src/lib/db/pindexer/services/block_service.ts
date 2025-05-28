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

export class BlockService {
  private db: Kysely<DB>;

  constructor(dbInstance: Kysely<DB>) {
    this.db = dbInstance;
  }

  /**
   * Fetches the latest block height from the supply_total_unstaked table.
   * This table is used in PindexerConnection as a source for the latest indexed height for some metrics.
   */
  async getLatestBlockHeightFromSupplyTable(): Promise<number | null> {
    try {
      const result = await this.db
        .selectFrom(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.name)
        .select(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT)
        .orderBy(DATA_SOURCES.SUPPLY_TOTAL_UNSTAKED.fields.HEIGHT, "desc")
        .limit(1)
        .executeTakeFirst();

      return result ? FIELD_TRANSFORMERS.toTokenAmount(result.height) : null;
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches the latest block details from the block_details table.
   */
  async getLatestBlockDetails(): Promise<Selectable<BlockDetails> | undefined> {
    try {
      return this.db
        .selectFrom(DATA_SOURCES.BLOCK_DETAILS.name)
        .selectAll()
        .orderBy(DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT, "desc")
        .limit(1)
        .executeTakeFirst();
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches the start and end block heights for a given duration window.
   */
  async getBlockHeightRangeForDays(
    days: number
  ): Promise<{ startHeight: number | null; endHeight: number | null }> {
    try {
      if (!days || days < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const result = await this.db
        .with("time_range", (_db) =>
          _db.selectNoFrom((eb) => [
            eb
              .selectFrom(DATA_SOURCES.BLOCK_DETAILS.name)
              .select(DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT)
              .where(DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP, "<=", endDate)
              .orderBy(DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP, "desc")
              .limit(1)
              .as("end_height_bigint"),
            eb
              .selectFrom(DATA_SOURCES.BLOCK_DETAILS.name)
              .select(DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT)
              .where(DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP, "<=", startDate)
              .orderBy(DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP, "desc")
              .limit(1)
              .as("start_height_bigint"),
          ])
        )
        .selectFrom("time_range")
        .select(["end_height_bigint" as any, "start_height_bigint" as any])
        .executeTakeFirst();

      return {
        startHeight: result?.start_height_bigint
          ? FIELD_TRANSFORMERS.toTokenAmount(result.start_height_bigint)
          : null,
        endHeight: result?.end_height_bigint
          ? FIELD_TRANSFORMERS.toTokenAmount(result.end_height_bigint)
          : null,
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
  async getBlockTimestampByHeight(height: number): Promise<Date | null> {
    try {
      if (!height || height < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const result = await this.db
        .selectFrom(DATA_SOURCES.BLOCK_DETAILS.name)
        .select(DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP)
        .where(DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT, "=", String(height))
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
        .selectFrom(DATA_SOURCES.BLOCK_DETAILS.name)
        .select([
          DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT,
          DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP,
          DATA_SOURCES.BLOCK_DETAILS.fields.ROOT,
        ])
        .where(DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT, ">=", String(startHeight))
        .where(DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT, "<=", String(endHeight))
        .orderBy(DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT, "asc")
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
        .selectFrom(DATA_SOURCES.BLOCK_DETAILS.name)
        .select([
          DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT,
          DATA_SOURCES.BLOCK_DETAILS.fields.TIMESTAMP,
          DATA_SOURCES.BLOCK_DETAILS.fields.ROOT,
        ])
        .orderBy(DATA_SOURCES.BLOCK_DETAILS.fields.HEIGHT, "desc")
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
