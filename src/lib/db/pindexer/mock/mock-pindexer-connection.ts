import {
  AbstractPindexerConnection,
  BurnMetrics,
  DurationWindow,
  LqtMetrics,
  PriceHistoryEntry,
  SocialMetrics,
  SupplyMetrics,
  TokenDistribution,
  TokenMetrics,
} from "../types";

export class MockPindexerConnection extends AbstractPindexerConnection {
  constructor() {
    super();
  }

  async getSocialMetrics(): Promise<SocialMetrics> {
    return {
      totalSupply: 1000000000,
      circulatingSupply: 900000000,
      marketCap: 500000000,
      price: 0.5,
      inflationRate: 0.02,
      burnRate: 0.0001,
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
        transactionFees: 12500000,
        dexArbitrage: 12000000,
        auctionBurns: 11500000,
        dexBurns: 10000000,
      },
      burnRate: 0.0001,
      historicalBurnRate: [
        { timestamp: "2024-01-01", rate: 0.00008 },
        { timestamp: "2024-02-01", rate: 0.00009 },
        { timestamp: "2024-03-01", rate: 0.0001 },
      ],
    };
  }

  async getSupplyMetrics(): Promise<SupplyMetrics> {
    return {
      totalSupply: 1000000000,
      genesisAllocation: 800000000,
      issuedSinceLaunch: 200000000,
      unstakedSupply: {
        base: 100000000,
        auction: 50000000,
        dex: 75000000,
        arbitrage: 25000000,
        fees: 10000000,
      },
      delegatedSupply: {
        base: 500000000,
        delegated: 300000000,
        conversionRate: 0.6,
      },
    };
  }

  async getPriceHistory(
    days: number = 90,
    window: DurationWindow = "1d"
  ): Promise<PriceHistoryEntry[]> {
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
