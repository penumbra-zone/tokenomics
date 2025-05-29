import { AssetId } from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import {
  AbstractPindexerConnection,
  BurnMetrics,
  DurationWindow,
  IssuanceMetrics,
  LqtMetrics,
  PriceHistoryEntry,
  PriceHistoryResult,
  SummaryMetrics,
  SupplyMetrics,
  TokenDistribution,
  TokenMetrics,
} from "../types";

export class MockPindexerConnection extends AbstractPindexerConnection {
  constructor() {
    super();
  }

  async getSummaryMetrics(): Promise<SummaryMetrics> {
    return {
      totalSupply: 1000000000,
      stakedTokens: 900000000,
      marketCap: 500000000,
      price: 0.5,
      inflation: {
        current: 0.02,
        lastMonth: 0.01,
      },
      totalBurned: 100000000,
    };
  }

  async getLqtMetrics(): Promise<LqtMetrics> {
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

  async getBurnMetrics(): Promise<BurnMetrics> {
    return {
      totalBurned: 50000000,
      bySource: {
        arbitrageBurns: 12500000,
        feeBurns: 12000000,
      },
      burnRate: 0.0001,
      historicalBurnRate: [
        { timestamp: "2024-06-01", rate: 0.075 },
        { timestamp: "2024-06-02", rate: 0.078 },
        { timestamp: "2024-06-03", rate: 0.082 },
        { timestamp: "2024-06-04", rate: 0.079 },
        { timestamp: "2024-06-05", rate: 0.081 },
        { timestamp: "2024-06-06", rate: 0.084 },
        { timestamp: "2024-06-07", rate: 0.087 },
        { timestamp: "2024-06-08", rate: 0.085 },
        { timestamp: "2024-06-09", rate: 0.089 },
        { timestamp: "2024-06-10", rate: 0.092 },
        { timestamp: "2024-06-11", rate: 0.088 },
        { timestamp: "2024-06-12", rate: 0.091 },
        { timestamp: "2024-06-13", rate: 0.094 },
        { timestamp: "2024-06-14", rate: 0.096 },
        { timestamp: "2024-06-15", rate: 0.093 },
        { timestamp: "2024-06-16", rate: 0.098 },
        { timestamp: "2024-06-17", rate: 0.101 },
        { timestamp: "2024-06-18", rate: 0.099 },
        { timestamp: "2024-06-19", rate: 0.103 },
        { timestamp: "2024-06-20", rate: 0.106 },
        { timestamp: "2024-06-21", rate: 0.104 },
        { timestamp: "2024-06-22", rate: 0.108 },
        { timestamp: "2024-06-23", rate: 0.111 },
        { timestamp: "2024-06-24", rate: 0.109 },
        { timestamp: "2024-06-25", rate: 0.113 },
        { timestamp: "2024-06-26", rate: 0.116 },
        { timestamp: "2024-06-27", rate: 0.114 },
        { timestamp: "2024-06-28", rate: 0.118 },
        { timestamp: "2024-06-29", rate: 0.121 },
        { timestamp: "2024-06-30", rate: 0.119 },
        { timestamp: "2024-07-01", rate: 0.123 },
        { timestamp: "2024-07-02", rate: 0.126 },
        { timestamp: "2024-07-03", rate: 0.124 },
        { timestamp: "2024-07-04", rate: 0.128 },
        { timestamp: "2024-07-05", rate: 0.131 },
        { timestamp: "2024-07-06", rate: 0.129 },
        { timestamp: "2024-07-07", rate: 0.133 },
        { timestamp: "2024-07-08", rate: 0.136 },
        { timestamp: "2024-07-09", rate: 0.134 },
        { timestamp: "2024-07-10", rate: 0.138 },
        { timestamp: "2024-07-11", rate: 0.141 },
        { timestamp: "2024-07-12", rate: 0.139 },
        { timestamp: "2024-07-13", rate: 0.143 },
        { timestamp: "2024-07-14", rate: 0.146 },
        { timestamp: "2024-07-15", rate: 0.144 },
        { timestamp: "2024-07-16", rate: 0.148 },
        { timestamp: "2024-07-17", rate: 0.151 },
        { timestamp: "2024-07-18", rate: 0.149 },
        { timestamp: "2024-07-19", rate: 0.153 },
        { timestamp: "2024-07-20", rate: 0.156 },
        { timestamp: "2024-07-21", rate: 0.154 },
        { timestamp: "2024-07-22", rate: 0.158 },
        { timestamp: "2024-07-23", rate: 0.161 },
        { timestamp: "2024-07-24", rate: 0.159 },
        { timestamp: "2024-07-25", rate: 0.163 },
        { timestamp: "2024-07-26", rate: 0.166 },
        { timestamp: "2024-07-27", rate: 0.164 },
        { timestamp: "2024-07-28", rate: 0.168 },
        { timestamp: "2024-07-29", rate: 0.171 },
        { timestamp: "2024-07-30", rate: 0.169 },
        { timestamp: "2024-07-31", rate: 0.173 },
        { timestamp: "2024-08-01", rate: 0.176 },
        { timestamp: "2024-08-02", rate: 0.174 },
        { timestamp: "2024-08-03", rate: 0.178 },
        { timestamp: "2024-08-04", rate: 0.181 },
        { timestamp: "2024-08-05", rate: 0.179 },
        { timestamp: "2024-08-06", rate: 0.183 },
        { timestamp: "2024-08-07", rate: 0.186 },
        { timestamp: "2024-08-08", rate: 0.184 },
        { timestamp: "2024-08-09", rate: 0.188 },
        { timestamp: "2024-08-10", rate: 0.191 },
        { timestamp: "2024-08-11", rate: 0.189 },
        { timestamp: "2024-08-12", rate: 0.193 },
        { timestamp: "2024-08-13", rate: 0.196 },
        { timestamp: "2024-08-14", rate: 0.194 },
        { timestamp: "2024-08-15", rate: 0.198 },
        { timestamp: "2024-08-16", rate: 0.201 },
        { timestamp: "2024-08-17", rate: 0.199 },
        { timestamp: "2024-08-18", rate: 0.203 },
        { timestamp: "2024-08-19", rate: 0.206 },
        { timestamp: "2024-08-20", rate: 0.204 },
        { timestamp: "2024-08-21", rate: 0.208 },
        { timestamp: "2024-08-22", rate: 0.211 },
        { timestamp: "2024-08-23", rate: 0.209 },
        { timestamp: "2024-08-24", rate: 0.213 },
        { timestamp: "2024-08-25", rate: 0.216 },
        { timestamp: "2024-08-26", rate: 0.214 },
        { timestamp: "2024-08-27", rate: 0.218 },
        { timestamp: "2024-08-28", rate: 0.221 },
        { timestamp: "2024-08-29", rate: 0.219 },
        { timestamp: "2024-08-30", rate: 0.223 },
        { timestamp: "2024-08-31", rate: 0.226 },
        { timestamp: "2024-09-01", rate: 0.224 },
        { timestamp: "2024-09-02", rate: 0.228 },
        { timestamp: "2024-09-03", rate: 0.231 },
        { timestamp: "2024-09-04", rate: 0.229 },
        { timestamp: "2024-09-05", rate: 0.233 },
        { timestamp: "2024-09-06", rate: 0.236 },
        { timestamp: "2024-09-07", rate: 0.234 },
        { timestamp: "2024-09-08", rate: 0.238 },
        { timestamp: "2024-09-09", rate: 0.241 },
        { timestamp: "2024-09-10", rate: 0.239 },
        { timestamp: "2024-09-11", rate: 0.243 },
        { timestamp: "2024-09-12", rate: 0.246 },
        { timestamp: "2024-09-13", rate: 0.244 },
        { timestamp: "2024-09-14", rate: 0.248 },
        { timestamp: "2024-09-15", rate: 0.251 },
        { timestamp: "2024-09-16", rate: 0.249 },
        { timestamp: "2024-09-17", rate: 0.253 },
        { timestamp: "2024-09-18", rate: 0.256 },
        { timestamp: "2024-09-19", rate: 0.254 },
        { timestamp: "2024-09-20", rate: 0.258 },
        { timestamp: "2024-09-21", rate: 0.261 },
        { timestamp: "2024-09-22", rate: 0.259 },
        { timestamp: "2024-09-23", rate: 0.263 },
        { timestamp: "2024-09-24", rate: 0.266 },
        { timestamp: "2024-09-25", rate: 0.264 },
        { timestamp: "2024-09-26", rate: 0.268 },
        { timestamp: "2024-09-27", rate: 0.271 },
        { timestamp: "2024-09-28", rate: 0.269 },
        { timestamp: "2024-09-29", rate: 0.273 },
        { timestamp: "2024-09-30", rate: 0.276 },
      ],
    };
  }

  async getSupplyMetrics(): Promise<SupplyMetrics> {
    return {
      totalSupply: 1000000000,
      totalStaked: 900000000,
      totalUnstaked: 100000000,
      genesisAllocation: 800000000,
      issuedSinceLaunch: 200000000,
      unstakedSupply: {
        base: 100000000,
        auction: 50000000,
        dex: 75000000,
        arbitrage: 25000000,
        fees: 10000000,
      },
    };
  }

  async getIssuanceMetrics(): Promise<IssuanceMetrics> {
    return {
      currentIssuance: 100000000,
      annualIssuance: 1000000000,
    };
  }

  async getPriceHistory(params: {
    baseAsset: AssetId;
    quoteAsset: AssetId;
    chainId: string;
    days?: number;
    window?: DurationWindow;
  }): Promise<PriceHistoryResult> {
    const { days = 90, window = "1d" } = params;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    let price = 2.0;
    let marketCap = 200_000_000;
    const data: PriceHistoryEntry[] = [];
    for (let i = 0; i < days; i++) {
      const change = (Math.random() - 0.5) * 0.08;
      price = Math.max(0.5, price + change);
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      data.push({
        date: date,
        price: Number(price.toFixed(2)),
      });
    }

    const allTimeHigh = Math.max(...data.map((entry) => entry.price));
    const allTimeLow = Math.min(...data.map((entry) => entry.price));

    return {
      priceHistory: data,
      allTimeHigh,
      allTimeLow,
    };
  }

  async getTokenDistribution(): Promise<TokenDistribution[]> {
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
    return {
      totalSupply: 1000000000,
      circulatingSupply: 750000000,
      burnedTokens: 50000000,
      marketCap: 500000000,
      price: 0.5,
    };
  }
}
