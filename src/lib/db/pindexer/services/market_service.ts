import { AssetId } from "@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb";
import { Kysely, sql } from "kysely";

import {
  DATA_SOURCES,
  DB_CONFIG,
  DB_ERROR_MESSAGES,
  FIELD_TRANSFORMERS,
} from "../database-mappings";
import { DB } from "../schema";
import type { CurrentMarketData, DurationWindow, PriceHistoryResult } from "../types";

// Constants
const MAINNET_CHAIN_ID = "penumbra-1";

// Define an interface for the raw row structure from the getPriceHistory query
interface RawPriceHistoryRow {
  height: string | number;
  price: string | number | null;
  market_cap: string | number | null;
  date: string;
}

// Define interface for candles data
interface CandleData {
  start_time: Date;
  open: number;
  close: number;
  low: number;
  high: number;
  swap_volume: number;
  direct_volume: number;
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
        .selectFrom(DATA_SOURCES.INSIGHTS_SUPPLY.name)
        .select([
          DATA_SOURCES.INSIGHTS_SUPPLY.fields.PRICE,
          DATA_SOURCES.INSIGHTS_SUPPLY.fields.MARKET_CAP,
        ])
        .where(DATA_SOURCES.INSIGHTS_SUPPLY.fields.PRICE, "is not", null)
        .orderBy(DATA_SOURCES.INSIGHTS_SUPPLY.fields.HEIGHT, "desc")
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
   * Fetches candles data for price history using dex_ex_price_charts table.
   * @param baseAsset The base asset ID
   * @param quoteAsset The quote asset ID (typically a stablecoin)
   * @param window The time window for candles
   * @param chainId The chain ID for filtering
   * @param days Number of days to look back (optional, used for additional filtering)
   */
  async getCandles({
    baseAsset,
    quoteAsset,
    window,
    chainId,
    days,
  }: {
    baseAsset: AssetId;
    quoteAsset: AssetId;
    window: DurationWindow;
    chainId: string;
    days?: number;
  }): Promise<CandleData[]> {
    try {
      let query = this.db
        .selectFrom(DATA_SOURCES.DEX_EX_PRICE_CHARTS.name)
        .select([
          DATA_SOURCES.DEX_EX_PRICE_CHARTS.fields.START_TIME,
          DATA_SOURCES.DEX_EX_PRICE_CHARTS.fields.OPEN,
          DATA_SOURCES.DEX_EX_PRICE_CHARTS.fields.CLOSE,
          DATA_SOURCES.DEX_EX_PRICE_CHARTS.fields.LOW,
          DATA_SOURCES.DEX_EX_PRICE_CHARTS.fields.HIGH,
          DATA_SOURCES.DEX_EX_PRICE_CHARTS.fields.SWAP_VOLUME,
          DATA_SOURCES.DEX_EX_PRICE_CHARTS.fields.DIRECT_VOLUME,
        ])
        .where(DATA_SOURCES.DEX_EX_PRICE_CHARTS.fields.THE_WINDOW, "=", window)
        .where(
          DATA_SOURCES.DEX_EX_PRICE_CHARTS.fields.ASSET_START,
          "=",
          Buffer.from(baseAsset.inner)
        )
        .where(
          DATA_SOURCES.DEX_EX_PRICE_CHARTS.fields.ASSET_END,
          "=",
          Buffer.from(quoteAsset.inner)
        )
        .orderBy(DATA_SOURCES.DEX_EX_PRICE_CHARTS.fields.START_TIME, "asc");

      // Due to a lot of price volatility at the launch of the chain, manually setting start date a few days later
      if (chainId === MAINNET_CHAIN_ID) {
        query = query.where(
          DATA_SOURCES.DEX_EX_PRICE_CHARTS.fields.START_TIME,
          ">=",
          new Date("2024-08-06")
        );
      }

      // If days is provided, filter to only show the last N days
      if (days && days > 0) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        query = query.where(DATA_SOURCES.DEX_EX_PRICE_CHARTS.fields.START_TIME, ">=", startDate);
      }

      return query.execute();
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches all-time high and low prices from the insights supply table.
   */
  async getAllTimeHighAndLow(): Promise<{ allTimeHigh: number; allTimeLow: number }> {
    try {
      const priceStats = await this.db
        .selectFrom(DATA_SOURCES.INSIGHTS_SUPPLY.name)
        .select([
          sql<number>`MAX(price)`.as("allTimeHigh"),
          sql<number>`MIN(price)`.as("allTimeLow"),
        ])
        .where(DATA_SOURCES.INSIGHTS_SUPPLY.fields.PRICE, "is not", null)
        .executeTakeFirst();

      const allTimeHigh = priceStats ? FIELD_TRANSFORMERS.toTokenAmount(priceStats.allTimeHigh) : 0;
      const allTimeLow = priceStats ? FIELD_TRANSFORMERS.toTokenAmount(priceStats.allTimeLow) : 0;

      return {
        allTimeHigh,
        allTimeLow,
      };
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }

  /**
   * Fetches detailed price history using candles data and converts to the expected format.
   * This provides daily price and market cap data.
   * @param baseAsset The base asset ID
   * @param quoteAsset The quote asset ID (typically a stablecoin)
   * @param chainId The chain ID
   * @param days Number of days to fetch data for
   * @param window The time window for candles (defaults to '1d')
   */
  async getPriceHistory({
    baseAsset,
    quoteAsset,
    chainId,
    days = DB_CONFIG.DEFAULT_PRICE_HISTORY_DAYS,
    window = "1d" as DurationWindow,
  }: {
    baseAsset: AssetId;
    quoteAsset: AssetId;
    chainId: string;
    days?: number;
    window?: DurationWindow;
  }): Promise<PriceHistoryResult> {
    try {
      if (!days || days < 0) {
        throw new Error(DB_ERROR_MESSAGES.INVALID_HEIGHT);
      }

      const candles = await this.getCandles({
        baseAsset,
        quoteAsset,
        window,
        chainId,
        days,
      });

      // Get all-time high and low from insights supply table
      const { allTimeHigh, allTimeLow } = await this.getAllTimeHighAndLow();

      const priceHistory = candles.map((candle) => ({
        date: candle.start_time,
        price: candle.close,
      }));

      return {
        priceHistory,
        allTimeHigh,
        allTimeLow,
      };
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
        .selectFrom(DATA_SOURCES.INSIGHTS_SUPPLY.name)
        .select([
          DATA_SOURCES.INSIGHTS_SUPPLY.fields.PRICE,
          DATA_SOURCES.INSIGHTS_SUPPLY.fields.MARKET_CAP,
          DATA_SOURCES.INSIGHTS_SUPPLY.fields.TOTAL_SUPPLY,
          DATA_SOURCES.INSIGHTS_SUPPLY.fields.STAKED_SUPPLY,
          DATA_SOURCES.INSIGHTS_SUPPLY.fields.HEIGHT,
        ])
        .where(DATA_SOURCES.INSIGHTS_SUPPLY.fields.PRICE, "is not", null)
        .orderBy(DATA_SOURCES.INSIGHTS_SUPPLY.fields.HEIGHT, "desc")
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
        .selectFrom(DATA_SOURCES.INSIGHTS_SUPPLY.name)
        .select(DATA_SOURCES.INSIGHTS_SUPPLY.fields.PRICE)
        .where(DATA_SOURCES.INSIGHTS_SUPPLY.fields.HEIGHT, "=", String(height))
        .where(DATA_SOURCES.INSIGHTS_SUPPLY.fields.PRICE, "is not", null)
        .executeTakeFirst();

      return result ? FIELD_TRANSFORMERS.toTokenAmount(result.price) : null;
    } catch (error) {
      console.error(DB_ERROR_MESSAGES.QUERY_FAILED, error);
      throw new Error(DB_ERROR_MESSAGES.QUERY_FAILED);
    }
  }
}
