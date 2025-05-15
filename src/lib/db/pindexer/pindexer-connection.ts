import { Pool, QueryResult, QueryResultRow } from "pg";

import { BLOCKS_PER_DAY, INFLATION_WINDOW_DAYS } from "../constants";
import {
  AbstractPindexerConnection,
  BurnMetrics,
  LqtMetrics,
  PriceHistoryEntry,
  SocialMetrics,
  SupplyMetrics,
  TokenDistribution,
  TokenMetrics,
} from "./types";

// --- PindexerConnection Class ---
export class PindexerConnection extends AbstractPindexerConnection {
  private pool: Pool;

  constructor(connectionString?: string) {
    super();
    this.pool = new Pool({
      connectionString: connectionString || process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }

  private async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  async getSocialMetrics(): Promise<SocialMetrics> {
    // Fetch supply and burn metrics
    const supply = await this.getSupplyMetrics();
    const burn = await this.getBurnMetrics();

    // Calculate totalSupply and circulatingSupply
    const totalSupply = supply.totalSupply;
    // Circulating supply: totalSupply minus all burned tokens (from burn metrics)
    const circulatingSupply = totalSupply - burn.totalBurned;

    // Placeholder for price (replace with real price source if available)
    const price = 0.5;
    // Market cap: totalSupply * price
    const marketCap = totalSupply * price;

    // --- Inflation Rate Calculation ---
    let inflationRate = await this.getInflationRate(totalSupply);

    // Burn rate from burn metrics
    const burnRate = burn.burnRate;

    return {
      totalSupply,
      circulatingSupply,
      marketCap,
      price,
      inflationRate,
      burnRate,
    };
  }

  private async getInflationRate(totalSupply: number) {
    const latestHeight = await this.fetchBlockHeight();
    const blocksAgo = BLOCKS_PER_DAY * INFLATION_WINDOW_DAYS;
    const pastHeight = Math.max(1, latestHeight - blocksAgo);
    const pastSupply = await this.fetchHistoricalSupplyByHeight(pastHeight);
    let inflationRate = 0;
    if (pastSupply > 0) {
      // Calculate window inflation
      const windowInflation = (totalSupply - pastSupply) / pastSupply;
      // Annualize: (365 / window_days)
      inflationRate = windowInflation * (365 / INFLATION_WINDOW_DAYS);
    }
    return inflationRate;
  }

  async getLqtMetrics(): Promise<LqtMetrics> {
    // TODO: Replace with real SQL query
    return {
      availableRewards: 10000000,
      delegatorRewards: 5000000,
      lpRewards: 3000000,
      votingPower: {
        total: 800000000,
        byAsset: [
          { asset: "PEN", votes: 500000000, share: 0.625 },
          { asset: "USDC", votes: 200000000, share: 0.25 },
          { asset: "ETH", votes: 100000000, share: 0.125 },
        ],
      },
    };
  }

  async getSupplyMetrics(): Promise<SupplyMetrics> {
    // Fetch unstaked supply components
    const unstaked = await this.fetchUnstakedSupplyComponents();
    // Fetch delegated supply components (per validator)
    const delegatedRows = await this.fetchDelegatedSupplyComponents();

    // Calculate totals
    const totalUnstaked =
      unstaked.um + unstaked.auction + unstaked.dex + unstaked.arb + unstaked.fees;
    const delegatedSupply = delegatedRows.reduce((sum, v) => sum + v.um + v.del_um, 0);
    const totalSupply = totalUnstaked + delegatedSupply;
    const conversionRate =
      delegatedRows.length > 0
        ? delegatedRows.reduce((sum, v) => sum + v.rate_bps2, 0) / (delegatedRows.length * 10000)
        : 0;

    return {
      totalSupply,
      genesisAllocation: 0,
      issuedSinceLaunch: 0,
      unstakedSupply: {
        base: unstaked.um,
        auction: unstaked.auction,
        dex: unstaked.dex,
        arbitrage: unstaked.arb,
        fees: unstaked.fees,
      },
      delegatedSupply: {
        base: delegatedRows.reduce((sum, v) => sum + v.um, 0),
        delegated: delegatedRows.reduce((sum, v) => sum + v.del_um, 0),
        conversionRate,
      },
    };
  }

  async getBurnMetrics(): Promise<BurnMetrics> {
    // Fetch burn sources
    const burns = await this.fetchBurnSources();
    // Fetch current block height
    const blockHeight = await this.fetchBlockHeight();

    const totalBurned = burns.fees + burns.dexArb + burns.auctionBurns + burns.dexBurns;
    const burnRate = blockHeight > 0 ? totalBurned / blockHeight : 0;

    // Optionally, fetch historical burn rates if needed
    const historicalBurnRate = await this.fetchHistoricalBurnRate();

    return {
      totalBurned,
      bySource: {
        transactionFees: burns.fees,
        dexArbitrage: burns.dexArb,
        auctionBurns: burns.auctionBurns,
        dexBurns: burns.dexBurns,
      },
      burnRate,
      historicalBurnRate,
    };
  }

  async getPriceHistory(days: number = 90): Promise<PriceHistoryEntry[]> {
    // TODO: Replace with real SQL query
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    let price = 2.0;
    let marketCap = 200_000_000;
    const data: PriceHistoryEntry[] = [];
    for (let i = 0; i < days; i++) {
      const change = (Math.random() - 0.5) * 0.08;
      price = Math.max(0.5, price + change);
      marketCap = Math.round(price * 100_000_000 + (Math.random() - 0.5) * 1_000_000);
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      data.push({
        date: date.toISOString().slice(0, 10),
        price: Number(price.toFixed(2)),
        marketCap,
      });
    }
    return data;
  }

  async getTokenDistribution(): Promise<TokenDistribution[]> {
    // TODO: Replace with real SQL query
    return [
      {
        category: "Staked",
        percentage: 40,
        amount: 400000000,
        subcategories: [
          { name: "Validators", amount: 300000000, percentage: 75 },
          { name: "Delegators", amount: 100000000, percentage: 25 },
        ],
      },
      {
        category: "DEX Liquidity",
        percentage: 25,
        amount: 250000000,
        subcategories: [
          { name: "PEN/USDC", amount: 150000000, percentage: 60 },
          { name: "PEN/ETH", amount: 100000000, percentage: 40 },
        ],
      },
      { category: "Community Pool", percentage: 15, amount: 150000000 },
      { category: "Circulating", percentage: 20, amount: 200000000 },
    ];
  }

  async getTokenMetrics(): Promise<TokenMetrics> {
    // TODO: Replace with real SQL query
    return {
      totalSupply: 1000000000,
      circulatingSupply: 750000000,
      burnedTokens: 50000000,
      marketCap: 500000000,
      price: 0.5,
    };
  }

  // --- Private Query Helpers ---

  private async fetchUnstakedSupplyComponents(): Promise<{
    um: number;
    auction: number;
    dex: number;
    arb: number;
    fees: number;
  }> {
    // Get the latest row from supply_total_unstaked
    const { rows } = await this.query<{
      um: string | number;
      auction: string | number;
      dex: string | number;
      arb: string | number;
      fees: string | number;
    }>(
      `SELECT um, auction, dex, arb, fees
       FROM supply_total_unstaked
       ORDER BY height DESC
       LIMIT 1`
    );
    const row = rows[0] || {};
    return {
      um: Number(row.um) || 0,
      auction: Number(row.auction) || 0,
      dex: Number(row.dex) || 0,
      arb: Number(row.arb) || 0,
      fees: Number(row.fees) || 0,
    };
  }

  private async fetchDelegatedSupplyComponents(): Promise<
    Array<{
      um: number;
      del_um: number;
      rate_bps2: number;
    }>
  > {
    // Get the latest height from supply_total_unstaked
    const { rows: heightRows } = await this.query<{ height: string | number }>(
      `SELECT MAX(height) as height FROM supply_total_unstaked`
    );
    const latestHeight = heightRows[0]?.height;
    if (!latestHeight) return [];
    // Get all rows for that height from supply_total_staked
    const { rows } = await this.query<{
      um: string | number;
      del_um: string | number;
      rate_bps2: string | number;
    }>(
      `SELECT um, del_um, rate_bps2
       FROM supply_total_staked
       WHERE height = $1`,
      [latestHeight]
    );
    return rows.map((row) => ({
      um: Number(row.um) || 0,
      del_um: Number(row.del_um) || 0,
      rate_bps2: Number(row.rate_bps2) || 0,
    }));
  }

  private async fetchBurnSources(): Promise<{
    fees: number;
    dexArb: number;
    auctionBurns: number;
    dexBurns: number;
  }> {
    // Use the latest row from supply_total_unstaked for burn analysis
    const { rows } = await this.query<{
      arb: string | number;
      fees: string | number;
      auction: string | number;
      dex: string | number;
    }>(
      `SELECT arb, fees, auction, dex
       FROM supply_total_unstaked
       ORDER BY height DESC
       LIMIT 1`
    );
    const row = rows[0] || {};
    return {
      fees: Number(row.fees) || 0, // Transaction fees burned
      dexArb: Number(row.arb) || 0, // DEX arbitrage burned
      auctionBurns: Number(row.auction) || 0, // Auction locked/burned
      dexBurns: Number(row.dex) || 0, // DEX locked/burned
    };
  }

  private async fetchBlockHeight(): Promise<number> {
    // Use the latest height from supply_total_unstaked
    const { rows } = await this.query<{ height: string | number }>(
      `SELECT height
       FROM supply_total_unstaked
       ORDER BY height DESC
       LIMIT 1`
    );
    return Number(rows[0]?.height) || 0;
  }

  private async fetchHistoricalBurnRate(): Promise<Array<{ timestamp: string; rate: number }>> {
    // Get the last 12 rows from supply_total_unstaked
    const { rows } = await this.query<{
      height: string | number;
      fees: string | number;
      arb: string | number;
      auction: string | number;
      dex: string | number;
      // If you have a timestamp column, add it here
      // timestamp: string;
    }>(
      `SELECT height, fees, arb, auction, dex
       FROM supply_total_unstaked
       ORDER BY height DESC
       LIMIT 12`
    );

    // Reverse to chronological order (oldest first)
    return rows.reverse().map((row) => {
      const totalBurns = Number(row.fees) + Number(row.arb) + Number(row.auction) + Number(row.dex);
      const height = Number(row.height) || 1;
      return {
        timestamp: String(row.height), // Replace with row.timestamp if available
        rate: totalBurns / height,
      };
    });
  }

  private async fetchHistoricalSupplyByHeight(targetHeight: number): Promise<number> {
    const { rows } = await this.query<{
      um: string | number;
      auction: string | number;
      dex: string | number;
      arb: string | number;
      fees: string | number;
    }>(
      `SELECT um, auction, dex, arb, fees
       FROM supply_total_unstaked
       WHERE height <= $1
       ORDER BY height DESC
       LIMIT 1`,
      [targetHeight]
    );
    const row = rows[0] || {};
    return (
      Number(row.um) + Number(row.auction) + Number(row.dex) + Number(row.arb) + Number(row.fees)
    );
  }
}
