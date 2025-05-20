// --- Types ---
export const durationWindows = ["1m", "15m", "1h", "4h", "1d", "1w", "1mo"] as const;
export type DurationWindow = (typeof durationWindows)[number];

export interface SocialMetrics {
  totalSupply: number;
  circulatingSupply: number;
  marketCap: number;
  price: number;
  inflationRate: number;
  burnRate: number;
}

export interface LqtMetrics {
  availableRewards: number;
  delegatorRewards: number;
  lpRewards: number;
  votingPower: {
    total: number;
    byAsset: Array<{
      asset: string;
      votes: number;
      share: number;
    }>;
  };
}

export interface BurnMetrics {
  totalBurned: number;
  bySource: {
    transactionFees: number;
    dexArbitrage: number;
    auctionBurns: number;
    dexBurns: number;
  };
  burnRate: number;
  historicalBurnRate: Array<{
    timestamp: string;
    rate: number;
  }>;
}

export interface SupplyMetrics {
  totalSupply: number;
  genesisAllocation: number;
  issuedSinceLaunch: number;
  unstakedSupply: {
    base: number;
    auction: number;
    dex: number;
    arbitrage: number;
    fees: number;
  };
  delegatedSupply: {
    base: number;
    delegated: number;
    conversionRate: number;
  };
}

export interface PriceHistoryEntry {
  date: string;
  price: number;
  marketCap: number;
}

export interface TokenDistribution {
  category: string;
  percentage: number;
  amount: number;
  subcategories?: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
}

export interface TokenMetrics {
  totalSupply: number;
  circulatingSupply: number;
  burnedTokens: number;
  marketCap: number;
  price: number;
}

export interface CurrentMarketData {
  price: number;
  marketCap: number;
}

export interface UnstakedSupplyComponents {
  um: number;
  auction: number;
  dex: number;
  arb: number;
  fees: number;
}

export interface DelegatedSupplyComponent {
  um: number;
  del_um: number;
  rate_bps2: number;
}

export interface BurnSourcesData {
  fees: number;
  dexArb: number;
  auctionBurns: number;
  dexBurns: number;
}

export interface HistoricalBurnEntryRaw {
  height: number;
  fees: number;
  dexArb: number;
  auctionBurns: number;
  dexBurns: number;
}

export abstract class AbstractPindexerConnection {
  abstract getSocialMetrics(): Promise<SocialMetrics>;
  abstract getLqtMetrics(): Promise<LqtMetrics>;
  abstract getBurnMetrics(): Promise<BurnMetrics>;
  abstract getSupplyMetrics(): Promise<SupplyMetrics>;
  abstract getPriceHistory(days: number, window: DurationWindow): Promise<PriceHistoryEntry[]>;
  abstract getTokenDistribution(): Promise<TokenDistribution[]>;
  abstract getTokenMetrics(): Promise<TokenMetrics>;
}
