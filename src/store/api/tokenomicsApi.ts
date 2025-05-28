import { SummaryMetrics } from "@/lib/db/pindexer";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

export interface LQTMetrics {
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

export interface PriceHistory {
  date: string;
  price: number;
  marketCap: number;
}

export interface SocialMetrics {
  totalSupply: number;
  circulatingSupply: number;
  marketCap: number;
  price: number;
  inflationRate: number;
  burnRate: number;
}

export const tokenomicsApi = createApi({
  reducerPath: "tokenomicsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["TokenMetrics", "TokenDistribution", "BurnMetrics", "LQTMetrics"],
  endpoints: (builder) => ({
    getSupplyMetrics: builder.query<SupplyMetrics, void>({
      query: () => "supply-metrics",
      providesTags: ["TokenMetrics"],
    }),
    getBurnMetrics: builder.query<BurnMetrics, void>({
      query: () => "burn-metrics",
      providesTags: ["BurnMetrics"],
    }),
    getLQTMetrics: builder.query<LQTMetrics, void>({
      query: () => "lqt-metrics",
      providesTags: ["LQTMetrics"],
    }),
    getTokenDistribution: builder.query<TokenDistribution[], void>({
      query: () => "token-distribution",
      providesTags: ["TokenDistribution"],
    }),
    getPriceHistory: builder.query<PriceHistory[], number>({
      query: (days) => `price-history?days=${days}`,
    }),
    getSummaryMetrics: builder.query<SummaryMetrics, void>({
      query: () => "summary-metrics",
      providesTags: ["TokenMetrics"],
    }),
  }),
});

export const {
  useGetSupplyMetricsQuery,
  useGetBurnMetricsQuery,
  useGetLQTMetricsQuery,
  useGetTokenDistributionQuery,
  useGetPriceHistoryQuery,
  useGetSummaryMetricsQuery,
} = tokenomicsApi;
