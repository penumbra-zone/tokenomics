import { query } from "@/lib/db/db";

// --- Types ---
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

export abstract class AbstractPindexerConnection {
  abstract getSocialMetrics(): Promise<SocialMetrics>;
  abstract getLqtMetrics(): Promise<LqtMetrics>;
  abstract getBurnMetrics(): Promise<BurnMetrics>;
  abstract getSupplyMetrics(): Promise<SupplyMetrics>;
  abstract getPriceHistory(days?: number): Promise<PriceHistoryEntry[]>;
  abstract getTokenDistribution(): Promise<TokenDistribution[]>;
  abstract getTokenMetrics(): Promise<TokenMetrics>;
}
