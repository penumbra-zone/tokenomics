import { Kysely } from "kysely";

import { DB } from "../schema";
// Correct path for DB types
import type { BurnSourcesData, HistoricalBurnEntryRaw } from "../types";

// Assuming these types are in types.ts
// blockService will be used by the caller (e.g., PindexerConnection or a higher-level orchestrator)
// to get timestamps if needed, to keep this service focused on burn data.

// Define an interface for the raw row structure from getHistoricalBurnEntriesRaw
interface RawBurnEntryRow {
  height: number | string | null;
  fees: number | string | null;
  dexArb: number | string | null;
  auctionBurns: number | string | null;
  dexBurns: number | string | null;
}

export class BurnService {
  private db: Kysely<DB>;

  constructor(dbInstance: Kysely<DB>) {
    this.db = dbInstance;
  }

  /**
   * Fetches the latest burn source components from supply_total_unstaked.
   * These are interpreted as fees burned, dex arbitrage burned, etc.
   */
  async getLatestBurnSources(): Promise<BurnSourcesData | null> {
    const result = await this.db
      .selectFrom("supply_total_unstaked")
      .select(["fees", "arb as dexArb", "auction as auctionBurns", "dex as dexBurns"])
      .orderBy("height", "desc")
      .limit(1)
      .executeTakeFirst();

    if (!result) return null;

    return {
      fees: result.fees ? Number(result.fees) : 0,
      dexArb: result.dexArb ? Number(result.dexArb) : 0,
      auctionBurns: result.auctionBurns ? Number(result.auctionBurns) : 0,
      dexBurns: result.dexBurns ? Number(result.dexBurns) : 0,
    };
  }

  /**
   * Fetches the last N historical burn entries (raw data) from supply_total_unstaked.
   * The rate calculation and timestamp association will be handled by the caller.
   * @param limit The number of historical entries to fetch.
   */
  async getHistoricalBurnEntriesRaw(limit: number = 100): Promise<HistoricalBurnEntryRaw[]> {
    const results = (await this.db
      .selectFrom("supply_total_unstaked")
      .select(["height", "fees", "arb as dexArb", "auction as auctionBurns", "dex as dexBurns"])
      .orderBy("height", "desc")
      .limit(limit)
      .execute()) as RawBurnEntryRow[];

    return results.map((row: RawBurnEntryRow) => ({
      height: row.height ? Number(row.height) : 0,
      fees: row.fees ? Number(row.fees) : 0,
      dexArb: row.dexArb ? Number(row.dexArb) : 0,
      auctionBurns: row.auctionBurns ? Number(row.auctionBurns) : 0,
      dexBurns: row.dexBurns ? Number(row.dexBurns) : 0,
    }));
  }
}
