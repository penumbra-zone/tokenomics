import { AssetId } from "@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb";
import { Kysely, sql } from "kysely";

import {
  DATA_SOURCES,
  DB_CONFIG,
  DB_ERROR_MESSAGES,
  FIELD_TRANSFORMERS,
} from "../database-mappings";
import { DB } from "../schema";
import type { CandleData, DurationWindow, PriceHistoryResult } from "../types";
import { mainnetConfig } from '@/lib/calculations';
import { AssetMetadataMap, BaseService } from "./base_service";

export class MarketService extends BaseService {
  constructor(dbInstance: Kysely<DB>, metadataMap: AssetMetadataMap) {
    super(dbInstance, metadataMap);
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
      if (chainId === mainnetConfig.chainId) {
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
}
