import { Kysely, sql } from "kysely";

import { DB } from "../schema";
import type { CurrentMarketData, PriceHistoryEntry } from "../types";

// Define an interface for the raw row structure from the getPriceHistory query
interface RawPriceHistoryRow {
  height: string | number;
  price: string | number;
  market_cap: string | number;
  date: string;
}

export class MarketService {
  private db: Kysely<DB>;

  constructor(dbInstance: Kysely<DB>) {
    this.db = dbInstance;
  }

  /**
   * Fetches the latest price and market cap from the insights_supply table.
   */
  async getLatestMarketData(): Promise<CurrentMarketData | null> {
    const result = await this.db
      .selectFrom("insights_supply")
      .select(["price as price", "market_cap as marketCap"])
      .orderBy("height", "desc")
      .limit(1)
      .executeTakeFirst();

    if (!result) return null;
    return {
      price: result.price ? Number(result.price) : 0,
      marketCap: result.marketCap ? Number(result.marketCap) : 0,
    };
  }

  /**
   * Fetches detailed price history using the insights_supply table.
   * This provides daily price and market cap data.
   * @param days Number of days to fetch data for
   */
  async getPriceHistory(days: number = 30): Promise<PriceHistoryEntry[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = (await this.db
      .selectFrom("insights_supply as i")
      .innerJoin("block_details as b", "b.height", "i.height")
      .select(["i.height", "i.price", "i.market_cap", sql<string>`DATE(b.timestamp)`.as("date")])
      .where("i.price", "is not", null)
      .where("b.timestamp", ">=", startDate)
      .orderBy("b.timestamp", "asc")
      .execute()) as RawPriceHistoryRow[];

    // Get one price point per day using window functions
    const dailyResults = (await this.db
      .with("daily_blocks", (eb) =>
        eb
          .selectFrom("insights_supply as i")
          .innerJoin("block_details as b", "b.height", "i.height")
          .select([
            "i.height",
            "i.price",
            "i.market_cap",
            sql<string>`DATE(b.timestamp)`.as("date"),
            sql<number>`ROW_NUMBER() OVER (PARTITION BY DATE(b.timestamp) ORDER BY b.height DESC)`.as(
              "rn"
            ),
          ])
          .where("i.price", "is not", null)
          .where("b.timestamp", ">=", startDate)
      )
      .selectFrom("daily_blocks")
      .select(["height", "price", "market_cap", "date"])
      .where("rn", "=", 1)
      .orderBy("date", "asc")
      .execute()) as RawPriceHistoryRow[];

    return dailyResults.map((row) => ({
      date: row.date,
      price: Number(row.price),
      marketCap: Number(row.market_cap),
    }));
  }
}
