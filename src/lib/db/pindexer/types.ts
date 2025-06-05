// --- Types ---
import { AssetId } from "@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb";

export const durationWindows = ["1m", "15m", "1h", "4h", "1d", "1w", "1mo"] as const;
export type DurationWindow = (typeof durationWindows)[number];

export interface SummaryMetrics {
  totalSupply: number;
  stakedTokens: number;
  marketCap: number;
  price: number;
  inflation: {
    current: number;
    lastMonth: number;
  };
  totalBurned: number;
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
  bySource: BurnDataBySource;
  burnRate: number;
  historicalBurnRate: Array<{
    timestamp: string;
    rate: number;
  }>;
}

export interface SupplyMetrics {
  totalSupply: number;
  totalStaked: number;
  totalUnstaked: number;
  genesisAllocation: number;
  issuedSinceLaunch: number;
  unstakedSupply: {
    base: number;
    auction: number;
    dex: number;
    arbitrage: number;
    fees: number;
  };
}

export interface IssuanceMetrics {
  currentIssuance: number;
  annualIssuance: number;
}

export interface PriceHistoryEntry {
  date: Date;
  price: number;
}

export interface PriceHistoryResult {
  priceHistory: PriceHistoryEntry[];
  allTimeHigh: number;
  allTimeLow: number;
}

export interface InflationTimeSeries {
  timeSeries: Array<{
    date: string;
    inflationRate: number;
    absoluteAmount: number;
  }>;
}

export interface TokenDistribution {
  category: string;
  percentage: number;
  amount: number;
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
  um: string;
  auction: string;
  dex: string;
  arb: string;
  fees: string;
}

export interface DelegatedSupplyComponent {
  um: number;
  del_um: number;
  rate_bps2: number;
}

export interface BurnSourcesData {
  arbitrageBurns: number;
  feeBurns: number;
  totalBurned: number;
}

export interface BurnDataBySource {
  arbitrageBurns: number; // Arbitrage burns
  feeBurns: number; // Fee burns
  dexLocked: number; // DEX locked
  auctionLocked: number; // Auction locked
}

export interface CandleData {
  start_time: Date;
  open: number;
  close: number;
  low: number;
  high: number;
  swap_volume: number;
  direct_volume: number;
}

export abstract class AbstractPindexerConnection {
  abstract getSummaryMetrics(): Promise<SummaryMetrics>;
  abstract getLqtMetrics(): Promise<LqtMetrics>;
  abstract getBurnMetrics(days: number): Promise<BurnMetrics>;
  abstract getSupplyMetrics(): Promise<SupplyMetrics>;
  abstract getIssuanceMetrics(): Promise<IssuanceMetrics>;
  abstract getPriceHistory(params: {
    baseAsset: AssetId;
    quoteAsset: AssetId;
    chainId: string;
    days?: number;
    window?: DurationWindow;
  }): Promise<PriceHistoryResult>;
  abstract getInflationTimeSeries(days: number): Promise<InflationTimeSeries>;
  abstract getTokenDistribution(): Promise<TokenDistribution[]>;
  abstract getTokenMetrics(): Promise<TokenMetrics>;
}
