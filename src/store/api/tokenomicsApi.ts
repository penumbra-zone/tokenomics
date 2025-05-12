import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface TokenMetrics {
  totalSupply: number;
  circulatingSupply: number;
  burnedTokens: number;
  marketCap: number;
  price: number;
}

export interface TokenDistribution {
  category: string;
  percentage: number;
  amount: number;
}

export interface PriceHistory {
  date: string;
  price: number;
}

export const tokenomicsApi = createApi({
  reducerPath: 'tokenomicsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['TokenMetrics', 'TokenDistribution'],
  endpoints: (builder) => ({
    getTokenMetrics: builder.query<TokenMetrics, void>({
      query: () => 'token-metrics',
      providesTags: ['TokenMetrics'],
    }),
    getTokenDistribution: builder.query<TokenDistribution[], void>({
      query: () => 'token-distribution',
      providesTags: ['TokenDistribution'],
    }),
    getPriceHistory: builder.query<PriceHistory[], void>({
      query: () => 'price-history',
    }),
  }),
});

export const {
  useGetTokenMetricsQuery,
  useGetTokenDistributionQuery,
  useGetPriceHistoryQuery,
} = tokenomicsApi; 