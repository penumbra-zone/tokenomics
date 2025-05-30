import {
  BurnDataBySource,
  IssuanceMetrics,
  PriceHistoryEntry,
  SummaryMetrics,
} from "@/lib/db/pindexer";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

export interface BurnMetrics {
  totalBurned: number;
  bySource: BurnDataBySource;
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
  tagTypes: [
    "TokenMetrics",
    "TokenDistribution",
    "BurnMetrics",
    "LQTMetrics",
    "IssuanceMetrics",
    "InflationTimeSeries",
    "PriceHistory",
  ],
  endpoints: (builder) => ({
    getSupplyMetrics: builder.query<SupplyMetrics, void>({
      query: () => "supply-metrics",
      providesTags: ["TokenMetrics"],
    }),
    getIssuanceMetrics: builder.query<IssuanceMetrics, void>({
      query: () => "issuance-metrics",
      providesTags: ["IssuanceMetrics"],
    }),
    getBurnMetrics: builder.query<BurnMetrics, number>({
      query: (days) => `burn-metrics?days=${days}`,
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
    getPriceHistory: builder.query<PriceHistory, number>({
      query: (days) => `price-history?days=${days}`,
      providesTags: ["PriceHistory"],
    }),
    getInflationTimeSeries: builder.query<InflationTimeSeries, number>({
      query: (days) => `inflation-time-series?days=${days}`,
      providesTags: ["InflationTimeSeries"],
    }),
    getSummaryMetrics: builder.query<SummaryMetrics, void>({
      query: () => "summary-metrics",
      providesTags: ["TokenMetrics"],
    }),
  }),
});

export const {
  useGetSupplyMetricsQuery,
  useGetIssuanceMetricsQuery,
  useGetBurnMetricsQuery,
  useGetLQTMetricsQuery,
  useGetTokenDistributionQuery,
  useGetPriceHistoryQuery,
  useGetInflationTimeSeriesQuery,
  useGetSummaryMetricsQuery,
} = tokenomicsApi;
