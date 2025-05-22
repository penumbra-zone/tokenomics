import { Kysely } from "kysely";

import { BLOCKS_PER_DAY, INFLATION_WINDOW_DAYS } from "../constants";
import { dbClient as defaultDb } from "./client";
import { DB } from "./schema";
// Import service classes
import { BlockService } from "./services/block_service";
import { BurnService } from "./services/burn_service";
import { MarketService } from "./services/market_service";
import { SupplyService } from "./services/supply_service";
import {
  AbstractPindexerConnection,
  BurnMetrics,
  BurnSourcesData,
  CurrentMarketData,
  DelegatedSupplyComponent,
  HistoricalBurnEntryRaw,
  LqtMetrics,
  PriceHistoryEntry,
  SocialMetrics,
  SupplyMetrics,
  TokenDistribution,
  TokenMetrics,
  UnstakedSupplyComponents,
} from "./types";

// --- Pindexer Class --- Pindexer (was PindexerConnection)
export class Pindexer extends AbstractPindexerConnection {
  private readonly blockService: BlockService;
  private readonly marketService: MarketService;
  private readonly supplyService: SupplyService;
  private readonly burnService: BurnService;

  constructor(protected dbInstance: Kysely<DB> = defaultDb) {
    super();
    this.blockService = new BlockService(dbInstance);
    this.marketService = new MarketService(dbInstance);
    this.supplyService = new SupplyService(dbInstance);
    this.burnService = new BurnService(dbInstance);
  }

  async getSocialMetrics(): Promise<SocialMetrics> {
    const supply = await this.getSupplyMetrics();
    const burn = await this.getBurnMetrics();

    const totalSupply = supply.totalSupply;
    const circulatingSupply = totalSupply - burn.totalBurned;

    const marketData: CurrentMarketData | null = await this.marketService.getLatestMarketData();

    const price = marketData?.price || 0;
    const marketCap = marketData?.marketCap || 0;

    const inflationRate = await this.getInflationRate(totalSupply);
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

  private async getInflationRate(currentTotalSupply: number): Promise<number> {
    const latestHeight = await this.blockService.getLatestBlockHeightFromSupplyTable();
    if (latestHeight === null) return 0;

    const blocksAgo = BLOCKS_PER_DAY * INFLATION_WINDOW_DAYS;
    const pastHeight = Math.max(1, latestHeight - blocksAgo);

    const pastTotalSupply =
      await this.supplyService.getHistoricalTotalSupplyFromInsights(pastHeight);

    if (pastTotalSupply === null || pastTotalSupply <= 0) return 0;

    const windowInflation = (currentTotalSupply - pastTotalSupply) / pastTotalSupply;
    const annualInflationRate = windowInflation * (365 / INFLATION_WINDOW_DAYS);

    return annualInflationRate;
  }

  async getLqtMetrics(): Promise<LqtMetrics> {
    // TODO: Implement with Kysely if LQT tables are in the schema, or keep as mock
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
    const unstakedComponents: UnstakedSupplyComponents | null =
      await this.supplyService.getLatestUnstakedSupplyComponents();
    if (!unstakedComponents) {
      return {
        totalSupply: 100,
        genesisAllocation: 25,
        issuedSinceLaunch: 75,
        unstakedSupply: { base: 0, auction: 0, dex: 0, arbitrage: 0, fees: 0 },
        delegatedSupply: { base: 0, delegated: 0, conversionRate: 0 },
      };
    }

    const latestStakedHeight = await this.blockService.getLatestBlockHeightFromSupplyTable();
    let delegatedSupplyComponents: DelegatedSupplyComponent[] = [];
    if (latestStakedHeight !== null) {
      delegatedSupplyComponents =
        await this.supplyService.getDelegatedSupplyComponentsByHeight(latestStakedHeight);
    }

    const totalUnstaked =
      unstakedComponents.um +
      unstakedComponents.auction +
      unstakedComponents.dex +
      unstakedComponents.arb +
      unstakedComponents.fees;
    const totalDelegatedBase = delegatedSupplyComponents.reduce((sum, v) => sum + v.um, 0);
    const totalDelegatedDelegated = delegatedSupplyComponents.reduce((sum, v) => sum + v.del_um, 0);
    const totalSupply = totalUnstaked + totalDelegatedBase + totalDelegatedDelegated;

    const avgConversionRate =
      delegatedSupplyComponents.length > 0
        ? delegatedSupplyComponents.reduce((sum, v) => sum + v.rate_bps2, 0) /
          (delegatedSupplyComponents.length * 10000)
        : 0;

    return {
      totalSupply,
      genesisAllocation: 70, // Placeholder
      issuedSinceLaunch: 30, // Placeholder
      unstakedSupply: {
        base: unstakedComponents.um,
        auction: unstakedComponents.auction,
        dex: unstakedComponents.dex,
        arbitrage: unstakedComponents.arb,
        fees: unstakedComponents.fees,
      },
      delegatedSupply: {
        base: totalDelegatedBase,
        delegated: totalDelegatedDelegated,
        conversionRate: avgConversionRate,
      },
    };
  }

  async getBurnMetrics(): Promise<BurnMetrics> {
    const latestBurnSources: BurnSourcesData | null = await this.burnService.getLatestBurnSources();
    const blockHeight = await this.blockService.getLatestBlockHeightFromSupplyTable();

    if (!latestBurnSources || blockHeight === null) {
      return {
        totalBurned: 0,
        bySource: { transactionFees: 0, dexArbitrage: 0, auctionBurns: 0, dexBurns: 0 },
        burnRate: 0,
        historicalBurnRate: [],
      };
    }

    const totalBurned =
      latestBurnSources.fees +
      latestBurnSources.dexArb +
      latestBurnSources.auctionBurns +
      latestBurnSources.dexBurns;
    const burnRate = blockHeight > 0 ? totalBurned / blockHeight : 0;

    const rawHistoricalBurns: HistoricalBurnEntryRaw[] =
      await this.burnService.getHistoricalBurnEntriesRaw(12);
    const historicalBurnRate = await Promise.all(
      rawHistoricalBurns.map(async (entry) => {
        const totalEntryBurns = entry.fees + entry.dexArb + entry.auctionBurns + entry.dexBurns;
        const entryHeight = entry.height || 1;
        const timestamp = await this.blockService.getBlockTimestampByHeight(entryHeight);
        return {
          timestamp: timestamp ? timestamp.toISOString().slice(0, 10) : String(entryHeight),
          rate: totalEntryBurns / entryHeight, // This rate is per block for that entry's total burns
        };
      })
    );

    return {
      totalBurned,
      bySource: {
        transactionFees: latestBurnSources.fees,
        dexArbitrage: latestBurnSources.dexArb,
        auctionBurns: latestBurnSources.auctionBurns,
        dexBurns: latestBurnSources.dexBurns,
      },
      burnRate, // This is an average burn rate across all blocks
      historicalBurnRate: historicalBurnRate.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ), // Ensure chronological order
    };
  }

  async getPriceHistory(days: number): Promise<PriceHistoryEntry[]> {
    const historyData = await this.marketService.getPriceHistory(days);
    return historyData;
  }

  async getTokenDistribution(): Promise<TokenDistribution[]> {
    // TODO: Implement with Kysely if data source exists, or keep as mock
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
    // TODO: Implement with Kysely if data source exists, or keep as mock
    return {
      totalSupply: 1000000000,
      circulatingSupply: 750000000,
      burnedTokens: 50000000,
      marketCap: 500000000,
      price: 0.5,
    };
  }
}

// Optional: Export an instance if commonly used, or let consumers instantiate.
// export const pindexer = new Pindexer();
