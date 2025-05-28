import { Kysely, sql } from "kysely";

import {
  DATA_SOURCES,
  DB_CONFIG,
  DB_ERROR_MESSAGES,
  FIELD_TRANSFORMERS,
} from "../database-mappings";
import { DB } from "../schema";
import type { CurrentMarketData, PriceHistoryEntry } from "../types";

// Define an interface for the raw row structure from the getPriceHistory query
interface RawPriceHistoryRow {
  height: string | number;
  price: string | number | null;
  market_cap: string | number | null;
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
    try {
      const result = await this.db
        .selectFrom(DATA_SOURCES.INSIGHTS_SUPPLY)
        .select([
          DATA_SOURCES.FIELDS.PRICE,
          DATA_SOURCES.FIELDS.MARKET_CAP,
        ])
        .where(DATA_SOURCES.FIELDS.PRICE, "is not", null)
        .orderBy(DATA_SOURCES.FIELDS.HEIGHT, "desc")
        .limit(1)
        .executeTakeFirst();

      if (!result) return null;

      if (!FIELD_TRANSFORMERS.validateMarketData(result)) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_DATA);
      }

      return {
        price: FIELD_TRANSFORMERS.toTokenAmount(result.price),
        marketCap: FIELD_TRANSFORMERS.toTokenAmount(result.market_cap),
      };
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches detailed price history using the insights_supply table.
   * This provides daily price and market cap data.
   * @param days Number of days to fetch data for
   */
  async getPriceHistory(
    days: number = DB_CONFIG.DEFAULT_PRICE_HISTORY_DAYS
  ): Promise<PriceHistoryEntry[]> {
    try {
      if (!days || days < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get one price point per day using window functions
      const dailyResults = await this.db
        .with("daily_blocks", (eb) =>
          eb
            .selectFrom(`${DATA_SOURCES.INSIGHTS_SUPPLY} as i`)
            .innerJoin(`${DATA_SOURCES.BLOCK_DETAILS} as b`, "b.height", "i.height")
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
        .execute();

      return dailyResults.map((row) => ({
        date: row.date,
        price: FIELD_TRANSFORMERS.toTokenAmount(row.price),
        marketCap: FIELD_TRANSFORMERS.toTokenAmount(row.market_cap),
      }));
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches price data for a specific time range.
   * @param startDate The start date for the range
   * @param endDate The end date for the range
   */
  async getPriceHistoryRange(startDate: Date, endDate: Date): Promise<PriceHistoryEntry[]> {
    try {
      const results = await this.db
        .selectFrom(`${DATA_SOURCES.INSIGHTS_SUPPLY} as i`)
        .innerJoin(`${DATA_SOURCES.BLOCK_DETAILS} as b`, "b.height", "i.height")
        .select(["i.height", "i.price", "i.market_cap", sql<string>`DATE(b.timestamp)`.as("date")])
        .where("i.price", "is not", null)
        .where("b.timestamp", ">=", startDate)
        .where("b.timestamp", "<=", endDate)
        .orderBy("b.timestamp", "asc")
        .execute();

      return results.map((row) => ({
        date: row.date,
        price: FIELD_TRANSFORMERS.toTokenAmount(row.price),
        marketCap: FIELD_TRANSFORMERS.toTokenAmount(row.market_cap),
      }));
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches the latest market data with additional supply information.
   */
  async getExtendedMarketData(): Promise<{
    price: number;
    marketCap: number;
    totalSupply: number;
    stakedSupply: number;
    height: number;
  } | null> {
    try {
      const result = await this.db
        .selectFrom(DATA_SOURCES.INSIGHTS_SUPPLY)
        .select([
          DATA_SOURCES.FIELDS.PRICE,
          DATA_SOURCES.FIELDS.MARKET_CAP,
          DATA_SOURCES.FIELDS.TOTAL_SUPPLY,
          DATA_SOURCES.FIELDS.STAKED_SUPPLY,
          DATA_SOURCES.FIELDS.HEIGHT,
        ])
        .where(DATA_SOURCES.FIELDS.PRICE, "is not", null)
        .orderBy(DATA_SOURCES.FIELDS.HEIGHT, "desc")
        .limit(1)
        .executeTakeFirst();

      if (!result) return null;

      return {
        price: FIELD_TRANSFORMERS.toTokenAmount(result.price),
        marketCap: FIELD_TRANSFORMERS.toTokenAmount(result.market_cap),
        totalSupply: FIELD_TRANSFORMERS.toTokenAmount(result.total),
        stakedSupply: FIELD_TRANSFORMERS.toTokenAmount(result.staked),
        height: FIELD_TRANSFORMERS.toTokenAmount(result.height),
      };
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches price at a specific block height.
   * @param height The block height
   */
  async getPriceAtHeight(height: number): Promise<number | null> {
    try {
      if (!height || height < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const result = await this.db
        .selectFrom(DATA_SOURCES.INSIGHTS_SUPPLY)
        .select(DATA_SOURCES.FIELDS.PRICE)
        .where(DATA_SOURCES.FIELDS.HEIGHT, "=", String(height))
        .where(DATA_SOURCES.FIELDS.PRICE, "is not", null)
        .executeTakeFirst();

      return result ? FIELD_TRANSFORMERS.toTokenAmount(result.price) : null;
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }
}
