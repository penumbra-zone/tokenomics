/**
 * Database Mappings and SQL Queries for Pindexer
 * Centralized configuration for database table and field mappings
 */

/**
 * Database table and field mappings based on implementation clarifications
 */
export const DATA_SOURCES = {
  // Primary supply data
  INSIGHTS_SUPPLY: "insights_supply",
  SUPPLY_TOTAL_UNSTAKED: "supply_total_unstaked",
  SUPPLY_TOTAL_STAKED: "supply_total_staked",
  BLOCK_DETAILS: "block_details",

  // Price and market data
  DEX_EX_PRICE_CHARTS: "dex_ex_price_charts",
  DEX_EX_AGGREGATE_SUMMARY: "dex_ex_aggregate_summary",
  DEX_EX_PAIRS_SUMMARY: "dex_ex_pairs_summary",
  DEX_EX_POSITION_STATE: "dex_ex_position_state",
  DEX_EX_POSITION_EXECUTIONS: "dex_ex_position_executions",
  DEX_EX_POSITION_RESERVES: "dex_ex_position_reserves",
  DEX_EX_POSITION_WITHDRAWALS: "dex_ex_position_withdrawals",
  DEX_EX_BLOCK_SUMMARY: "dex_ex_block_summary",
  DEX_EX_TRANSACTIONS: "dex_ex_transactions",

  // LQT data
  LQT_SUMMARY: "lqt.summary",
  LQT_LPS: "lqt.lps",
  LQT_GAUGE: "lqt.gauge",
  LQT_DELEGATOR_SUMMARY: "lqt.delegator_summary",
  LQT_DELEGATOR_HISTORY: "lqt.delegator_history",

  // Field mappings
  FIELDS: {
    // insights_supply fields
    TOTAL_SUPPLY: "total",
    STAKED_SUPPLY: "staked",
    MARKET_CAP: "market_cap",
    PRICE: "price",
    PRICE_NUMERAIRE_ASSET_ID: "price_numeraire_asset_id",
    HEIGHT: "height",

    // supply_total_unstaked fields
    CIRCULATING: "um",
    DEX_LIQUIDITY: "dex",
    AUCTION_LOCKED: "auction",
    ARBITRAGE_BURNS: "arb",
    FEE_BURNS: "fees",

    // supply_total_staked fields
    STAKED_UM: "um",
    DELEGATED_UM: "del_um",
    RATE_BPS2: "rate_bps2",
    VALIDATOR_ID: "validator_id",

    // block_details fields
    TIMESTAMP: "timestamp",
    ROOT: "root",

    // dex_ex_price_charts fields
    START_TIME: "start_time",
    OPEN: "open",
    HIGH: "high",
    LOW: "low",
    CLOSE: "close",
    DIRECT_VOLUME: "direct_volume",
    SWAP_VOLUME: "swap_volume",
    THE_WINDOW: "the_window",
    ASSET_START: "asset_start",
    ASSET_END: "asset_end",

    // dex position fields
    POSITION_ID: "position_id",
    RESERVES_1: "reserves_1",
    RESERVES_2: "reserves_2",

    // lqt fields
    EPOCH: "epoch",
    POINTS: "points",
    VOLUME: "volume",
    REWARDS: "rewards",
  },
} as const;

/**
 * Field validation and transformation helpers
 */
export const FIELD_TRANSFORMERS = {
  // Convert database values to application format
  toTokenAmount: (value: string | number | null): number => {
    if (value === null || value === undefined) return 0;
    return typeof value === "string" ? parseFloat(value) : value;
  },

  toPercentage: (value: string | number | null): number => {
    if (value === null || value === undefined) return 0;
    const num = typeof value === "string" ? parseFloat(value) : value;
    return num * 100; // Convert decimal to percentage
  },

  toTimestamp: (value: string | Date | null): Date | null => {
    if (value === null || value === undefined) return null;
    return typeof value === "string" ? new Date(value) : value;
  },

  toBigIntString: (value: string | number | bigint): string => {
    return value.toString();
  },

  // Validate required fields
  validateSupplyData: (data: any): boolean => {
    return (
      data &&
      typeof data.total !== "undefined" &&
      typeof data.staked !== "undefined" &&
      typeof data.height !== "undefined"
    );
  },

  validateBurnData: (data: any): boolean => {
    return (
      data &&
      typeof data.arb !== "undefined" &&
      typeof data.fees !== "undefined" &&
      typeof data.height !== "undefined"
    );
  },

  validateMarketData: (data: any): boolean => {
    return data && typeof data.price !== "undefined" && typeof data.market_cap !== "undefined";
  },

  validateBlockData: (data: any): boolean => {
    return data && typeof data.height !== "undefined" && typeof data.timestamp !== "undefined";
  },
} as const;

/**
 * Error handling for database operations
 */
export const DB_ERROR_MESSAGES = {
  CONNECTION_FAILED: "Failed to connect to database",
  QUERY_FAILED: "Database query failed",
  INVALID_DATA: "Invalid data format returned from database",
  MISSING_REQUIRED_FIELDS: "Required fields missing from database response",
  TIMEOUT: "Database query timeout",
  INVALID_HEIGHT: "Invalid block height provided",
  INVALID_POSITION_ID: "Invalid position ID provided",
  INVALID_DURATION_WINDOW: "Invalid duration window provided",
} as const;

/**
 * Database connection configuration
 */
export const DB_CONFIG = {
  // Default limits
  DEFAULT_HISTORY_LIMIT: 100,
  MAX_HISTORY_LIMIT: 1000,
  DEFAULT_PRICE_HISTORY_DAYS: 30,
} as const;
