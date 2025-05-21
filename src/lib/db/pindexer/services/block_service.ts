import type { Selectable } from "kysely";
import { Kysely } from "kysely";

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
    const result = await this.db
      .selectFrom("supply_total_unstaked")
      .select("height")
      .orderBy("height", "desc")
      .limit(1)
      .executeTakeFirst();

    return result ? Number(result.height) : null;
  }

  /**
   * Fetches the latest block details from the block_details table.
   */
  async getLatestBlockDetails(): Promise<Selectable<BlockDetails> | undefined> {
    return this.db
      .selectFrom("block_details")
      .selectAll()
      .orderBy("height", "desc")
      .limit(1)
      .executeTakeFirst();
  }

  /**
   * Fetches the start and end block heights for a given duration window.
   */
  async getBlockHeightRangeForDays(
    days: number
  ): Promise<{ startHeight: number | null; endHeight: number | null }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await this.db
      .with("time_range", (_db) =>
        _db.selectNoFrom((eb) => [
          eb
            .selectFrom("block_details")
            .select("height")
            .where("timestamp", "<=", endDate)
            .orderBy("timestamp", "desc")
            .limit(1)
            .as("end_height_bigint"),
          eb
            .selectFrom("block_details")
            .select("height")
            .where("timestamp", "<=", startDate)
            .orderBy("timestamp", "desc")
            .limit(1)
            .as("start_height_bigint"),
        ])
      )
      .selectFrom("time_range")
      .select(["end_height_bigint" as any, "start_height_bigint" as any])
      .executeTakeFirst();

    return {
      startHeight: result?.start_height_bigint ? Number(result.start_height_bigint) : null,
      endHeight: result?.end_height_bigint ? Number(result.end_height_bigint) : null,
    };
  }

  /**
   * Fetches the timestamp for a specific block height.
   * @param height The block height.
   */
  async getBlockTimestampByHeight(height: number): Promise<Date | null> {
    const result = await this.db
      .selectFrom("block_details")
      .select("timestamp")
      .where("height", "=", String(height))
      .executeTakeFirst();
    return result ? result.timestamp : null;
  }
}
