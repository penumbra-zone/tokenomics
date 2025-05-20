import { Kysely, sql } from "kysely";

import { DB } from "../schema";
// Correct path for DB types
import type { DelegatedSupplyComponent, UnstakedSupplyComponents } from "../types";

// Assuming these types are in types.ts

// Define an interface for the raw row structure from getDelegatedSupplyComponentsByHeight
interface RawDelegatedSupplyRow {
  um: number | string | null; // Assuming these can come as string from DB or be null
  del_um: number | string | null;
  rate_bps2: number | string | null;
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
    const result = await this.db
      .selectFrom("supply_total_unstaked")
      .select(["um", "auction", "dex", "arb", "fees"])
      .orderBy("height", "desc")
      .limit(1)
      .executeTakeFirst();

    if (!result) return null;

    return {
      um: result.um ? Number(result.um) : 0,
      auction: result.auction ? Number(result.auction) : 0,
      dex: result.dex ? Number(result.dex) : 0,
      arb: result.arb ? Number(result.arb) : 0,
      fees: result.fees ? Number(result.fees) : 0,
    };
  }

  /**
   * Fetches delegated supply components for a given block height.
   * In PindexerConnection, this was fetched for the latest height from supply_total_unstaked.
   * @param height The block height to fetch delegated supply for.
   */
  async getDelegatedSupplyComponentsByHeight(height: number): Promise<DelegatedSupplyComponent[]> {
    const results = (await this.db
      .selectFrom("supply_total_staked")
      .select(["um", "del_um", "rate_bps2"])
      .where("height", "=", String(height))
      .execute()) as RawDelegatedSupplyRow[];

    return results.map((row: RawDelegatedSupplyRow) => ({
      um: row.um ? Number(row.um) : 0,
      del_um: row.del_um ? Number(row.del_um) : 0,
      rate_bps2: row.rate_bps2 ? Number(row.rate_bps2) : 0,
    }));
  }

  /**
   * Fetches the sum of unstaked supply components (um, auction, dex, arb, fees)
   * from supply_total_unstaked at or before a specific block height.
   * Note: This represents unstaked supply. For total supply, staked supply must be added,
   * or a direct total supply metric (e.g., from insights_supply.total) should be used.
   * @param height The block height.
   */
  async getHistoricalUnstakedSupplySumByHeight(height: number): Promise<number | null> {
    const result = await this.db
      .selectFrom("supply_total_unstaked")
      .select(sql<number>`(um + auction + dex + arb + fees)`.as("total_unstaked"))
      .where("height", "=", String(height))
      .executeTakeFirst();

    return result?.total_unstaked ?? null;
  }

  /**
   * Fetches the total supply from the insights_supply table for a specific block height.
   * This is a more direct way to get total supply if available and populated.
   * @param height The block height.
   */
  async getHistoricalTotalSupplyFromInsights(height: number): Promise<number | null> {
    const result = await this.db
      .selectFrom("insights_supply")
      .select(["total as totalSupply"])
      .where("height", "=", String(height))
      .executeTakeFirst();

    return result?.totalSupply ? Number(result.totalSupply) : null;
  }
}
