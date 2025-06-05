import type { Selectable } from "kysely";
import { Kysely } from "kysely";

import { CalculationContext } from "@/lib/calculations/types";
import {
  DATA_SOURCES,
  DB_CONFIG,
  DB_ERROR_MESSAGES,
  FIELD_TRANSFORMERS,
} from "../database-mappings";
import type { BlockDetails } from "../schema";
import { DB } from "../schema";
import { AssetMetadataMap, BaseService } from "./base_service";

const TABLE = DATA_SOURCES.BLOCK_DETAILS;

export class BlockService extends BaseService {
  constructor(dbInstance: Kysely<DB>, metadataMap: AssetMetadataMap) {
    super(dbInstance, metadataMap);
  }

  /**
   * Fetches the latest block details from the block_details table.
   */
  async getLatestBlockDetails(context: CalculationContext): Promise<Selectable<BlockDetails>> {
    try {
      // Get the latest block details
      const result = await this.db
        .selectFrom(TABLE.name)
        .selectAll()
        .orderBy(TABLE.fields.HEIGHT, "desc")
        .limit(1)
        .executeTakeFirstOrThrow();

      // Mechanism to update the calculation context with the latest block details
      context.currentHeight = FIELD_TRANSFORMERS.toTokenAmount(result.height);
      context.currentTimestamp = FIELD_TRANSFORMERS.toTimestamp(result.timestamp) || new Date();

      return result;
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches the start and end block heights for a given duration window.
   */
  async getBlockRangeForDays(
    days: number,
    endDate: Date = new Date()
  ): Promise<{
    startBlock: { height: string; timestamp: Date };
    endBlock: { height: string; timestamp: Date };
  }> {
    try {
      if (!days || days < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const startDate = new Date(endDate.getTime());
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
}
