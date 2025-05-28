/**
 * Database Mappings and SQL Queries for Pindexer
 * Centralized configuration for database table and field mappings
 */

/**
 * Database table and field mappings based on implementation clarifications
 */
export const DATA_SOURCES = {
  // Primary supply data
  INSIGHTS_SUPPLY: {
    name: "insights_supply",
    fields: {
      TOTAL_SUPPLY: "total",
      STAKED_SUPPLY: "staked",
      MARKET_CAP: "market_cap",
      PRICE: "price",
      PRICE_NUMERAIRE_ASSET_ID: "price_numeraire_asset_id",
      HEIGHT: "height",
    },
  },
  SUPPLY_TOTAL_UNSTAKED: {
    name: "supply_total_unstaked",
    fields: {
      CIRCULATING: "um",
      DEX_LIQUIDITY: "dex",
      AUCTION_LOCKED: "auction",
      ARBITRAGE_BURNS: "arb",
      FEE_BURNS: "fees",
      HEIGHT: "height",
    },
  },
  SUPPLY_TOTAL_STAKED: {
    name: "supply_total_staked",
    fields: {
      STAKED_UM: "um",
      DELEGATED_UM: "del_um",
      RATE_BPS2: "rate_bps2",
      VALIDATOR_ID: "validator_id",
      HEIGHT: "height",
    },
  },
  BLOCK_DETAILS: {
    name: "block_details",
    fields: {
      HEIGHT: "height",
      TIMESTAMP: "timestamp",
      ROOT: "root",
    },
  },

  // Price and market data
  DEX_EX_PRICE_CHARTS: {
    name: "dex_ex_price_charts",
    fields: {
      HEIGHT: "height",
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
    },
  },
  DEX_EX_AGGREGATE_SUMMARY: {
    name: "dex_ex_aggregate_summary",
    fields: {
      HEIGHT: "height",
      THE_WINDOW: "the_window",
    },
  },
  DEX_EX_PAIRS_SUMMARY: {
    name: "dex_ex_pairs_summary",
    fields: {
      HEIGHT: "height",
      THE_WINDOW: "the_window",
    },
  },
  DEX_EX_POSITION_STATE: {
    name: "dex_ex_position_state",
    fields: {
      POSITION_ID: "position_id",
      HEIGHT: "height",
    },
  },
  DEX_EX_POSITION_EXECUTIONS: {
    name: "dex_ex_position_executions",
    fields: {
      POSITION_ID: "position_id",
      HEIGHT: "height",
    },
  },
  DEX_EX_POSITION_RESERVES: {
    name: "dex_ex_position_reserves",
    fields: {
      POSITION_ID: "position_id",
      RESERVES_1: "reserves_1",
      RESERVES_2: "reserves_2",
      HEIGHT: "height",
    },
  },
  DEX_EX_POSITION_WITHDRAWALS: {
    name: "dex_ex_position_withdrawals",
    fields: {
      POSITION_ID: "position_id",
      HEIGHT: "height",
    },
  },
  DEX_EX_BLOCK_SUMMARY: {
    name: "dex_ex_block_summary",
    fields: {
      HEIGHT: "height",
    },
  },
  DEX_EX_TRANSACTIONS: {
    name: "dex_ex_transactions",
    fields: {
      HEIGHT: "height",
    },
  },

  // LQT data
  LQT_SUMMARY: {
    name: "lqt.summary",
    fields: {
      EPOCH: "epoch",
      HEIGHT: "height",
    },
  },
  LQT_LPS: {
    name: "lqt.lps",
    fields: {
      EPOCH: "epoch",
      POINTS: "points",
      HEIGHT: "height",
    },
  },
  LQT_GAUGE: {
    name: "lqt.gauge",
    fields: {
      EPOCH: "epoch",
      HEIGHT: "height",
    },
  },
  LQT_DELEGATOR_SUMMARY: {
    name: "lqt.delegator_summary",
    fields: {
      EPOCH: "epoch",
      HEIGHT: "height",
    },
  },
  LQT_DELEGATOR_HISTORY: {
    name: "lqt.delegator_history",
    fields: {
      EPOCH: "epoch",
      VOLUME: "volume",
      REWARDS: "rewards",
      HEIGHT: "height",
    },
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
