import { dbClient } from "../client";
import { type DurationWindow } from "../types";

export class DexService {
  async getAggregateSummary(window: DurationWindow) {
    return dbClient
      .selectFrom("dex_ex_aggregate_summary")
      .selectAll()
      .where("the_window", "=", window)
      .executeTakeFirst();
  }

  async getPairsSummary(window: DurationWindow) {
    return dbClient
      .selectFrom("dex_ex_pairs_summary")
      .selectAll()
      .where("the_window", "=", window)
      .orderBy("direct_volume_indexing_denom_over_window", "desc")
      .execute();
  }

  async getPositionState(positionId: Buffer) {
    return dbClient
      .selectFrom("dex_ex_position_state")
      .selectAll()
      .where("position_id", "=", positionId)
      .executeTakeFirst();
  }

  async getPositionExecutions(positionId: Buffer) {
    return dbClient
      .selectFrom("dex_ex_position_executions")
      .selectAll()
      .where("position_id", "=", positionId)
      .orderBy("time", "desc")
      .execute();
  }

  async getPositionReserves(positionId: Buffer) {
    return dbClient
      .selectFrom("dex_ex_position_reserves")
      .selectAll()
      .where("position_id", "=", positionId)
      .orderBy("time", "desc")
      .execute();
  }

  async getPositionWithdrawals(positionId: Buffer) {
    return dbClient
      .selectFrom("dex_ex_position_withdrawals")
      .selectAll()
      .where("position_id", "=", positionId)
      .orderBy("time", "desc")
      .execute();
  }

  async getBlockSummary(height: number) {
    return dbClient
      .selectFrom("dex_ex_block_summary")
      .selectAll()
      .where("height", "=", height)
      .executeTakeFirst();
  }

  async getTransaction(txHash: Buffer) {
    return dbClient
      .selectFrom("dex_ex_transactions")
      .selectAll()
      .where("transaction_id", "=", txHash)
      .executeTakeFirst();
  }
}

export const dbService = new DexService();
