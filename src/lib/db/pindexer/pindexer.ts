import { Kysely } from "kysely";

import { BLOCKS_PER_DAY, INFLATION_WINDOW_DAYS } from "../constants";
import { dbClient as defaultDb } from "./client";
import { DB } from "./schema";
// Import service classes
import {
  BurnData,
  calculateBurnMetrics,
  calculateBurnRateTimeSeries,
  calculateCirculatingSupply,
  calculateInflationRate,
  calculateIssuanceSinceLaunch,
  calculateMarketCap,
  calculateTokenDistributionBreakdown,
  calculateTotalDelegatedSupply,
  calculateTotalSupplyFromComponents,
  calculateTotalUnstakedSupply,
  CalculationContext,
  getCurrentNetworkConfig,
} from "../../calculations";
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

export class Pindexer extends AbstractPindexerConnection {
  private readonly blockService: BlockService;
  private readonly marketService: MarketService;
  private readonly supplyService: SupplyService;
  private readonly burnService: BurnService;
  private readonly calculationContext: CalculationContext;

  constructor(protected dbInstance: Kysely<DB> = defaultDb) {
    super();
    this.blockService = new BlockService(dbInstance);
    this.marketService = new MarketService(dbInstance);
    this.supplyService = new SupplyService(dbInstance);
    this.burnService = new BurnService(dbInstance);

    // Initialize calculation context with current network config
    const config = getCurrentNetworkConfig();
    this.calculationContext = {
      config,
      currentHeight: 0, // Will be updated dynamically
      currentTimestamp: new Date(),
    };
  }

  async getSocialMetrics(): Promise<SocialMetrics> {
    const supply = await this.getSupplyMetrics();
    const burn = await this.getBurnMetrics();

    const totalSupply = supply.totalSupply;

    // Use centralized calculation for circulating supply
    const circulatingSupply = calculateCirculatingSupply(
      totalSupply,
      supply.delegatedSupply.base + supply.delegatedSupply.delegated, // staked supply
      supply.unstakedSupply.dex, // dex liquidity
      0 // community pool (TODO: get actual value)
    );

    const marketData: CurrentMarketData | null = await this.marketService.getLatestMarketData();

    const price = marketData?.price || 0;
    // Use centralized calculation for market cap
    const marketCap = marketData?.marketCap || calculateMarketCap(totalSupply, price);

    // Update calculation context with current data
    const currentHeight = (await this.blockService.getLatestBlockHeightFromSupplyTable()) || 0;
    this.calculationContext.currentHeight = currentHeight;
    this.calculationContext.currentTimestamp = new Date();

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

    // Use centralized calculation for inflation rate
    const windowInflationRate = calculateInflationRate(currentTotalSupply, pastTotalSupply);

    // Convert to annual rate (the centralized function returns percentage, we need to convert to decimal and annualize)
    const annualInflationRate = (windowInflationRate / 100) * (365 / INFLATION_WINDOW_DAYS);

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
      throw new Error("No unstaked components found");
    }

    const latestStakedHeight = await this.blockService.getLatestBlockHeightFromSupplyTable();
    let delegatedSupplyComponents: DelegatedSupplyComponent[] = [];
    if (latestStakedHeight === null) {
      throw new Error("No staked height found");
    }

    delegatedSupplyComponents = await this.supplyService.getDelegatedSupplyComponentsByHeight(
      latestStakedHeight || 0
    );

    // Use centralized calculations for supply components
    const totalUnstaked = calculateTotalUnstakedSupply(unstakedComponents);
    const delegatedSupplyData = calculateTotalDelegatedSupply(delegatedSupplyComponents);
    const totalSupply = calculateTotalSupplyFromComponents(
      unstakedComponents,
      delegatedSupplyComponents
    );

    // Use centralized calculation for issuance since launch
    const { genesisAllocation } = this.calculationContext.config;
    const issuedSinceLaunch = calculateIssuanceSinceLaunch(totalSupply, genesisAllocation);

    return {
      totalSupply,
      totalUnstaked,
      genesisAllocation,
      issuedSinceLaunch,
      unstakedSupply: {
        base: unstakedComponents.um,
        auction: unstakedComponents.auction,
        dex: unstakedComponents.dex,
        arbitrage: unstakedComponents.arb,
        fees: unstakedComponents.fees,
      },
      delegatedSupply: {
        base: delegatedSupplyData.totalDelegatedBase,
        delegated: delegatedSupplyData.totalDelegatedDelegated,
        conversionRate: delegatedSupplyData.avgConversionRate,
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

    // Prepare burn data for centralized calculations
    const currentBurnData: BurnData = {
      fees: latestBurnSources.fees,
      dexArb: latestBurnSources.dexArb,
      auctionBurns: latestBurnSources.auctionBurns,
      dexBurns: latestBurnSources.dexBurns,
      height: blockHeight,
      timestamp: new Date(),
    };

    // Get historical burn data
    const rawHistoricalBurns: HistoricalBurnEntryRaw[] =
      await this.burnService.getHistoricalBurnEntriesRaw(12);

    const historicalBurnData: BurnData[] = await Promise.all(
      rawHistoricalBurns.map(async (entry) => {
        const entryHeight = entry.height || 1;
        const timestamp = await this.blockService.getBlockTimestampByHeight(entryHeight);
        return {
          fees: entry.fees,
          dexArb: entry.dexArb,
          auctionBurns: entry.auctionBurns,
          dexBurns: entry.dexBurns,
          height: entryHeight,
          timestamp: timestamp || new Date(),
        };
      })
    );

    const allBurnData = [...historicalBurnData, currentBurnData];

    const totalSupply =
      (await this.supplyService.getHistoricalTotalSupplyFromInsights(blockHeight)) || 0;
    const burnMetrics = calculateBurnMetrics(allBurnData, totalSupply, this.calculationContext);

    const burnRateTimeSeries = calculateBurnRateTimeSeries(historicalBurnData);

    // Convert to the expected format for backward compatibility
    const historicalBurnRate = burnRateTimeSeries.map((entry) => ({
      timestamp: entry.date,
      rate: entry.burnRate,
    }));

    return {
      totalBurned: burnMetrics.totalBurned,
      bySource: burnMetrics.burnsBySource,
      burnRate: burnMetrics.burnRatePerDay,
      historicalBurnRate,
    };
  }

  async getPriceHistory(days: number): Promise<PriceHistoryEntry[]> {
    const historyData = await this.marketService.getPriceHistory(days);
    return historyData;
  }

  async getTokenDistribution(): Promise<TokenDistribution[]> {
    // Get current supply metrics to calculate distribution
    const supplyMetrics = await this.getSupplyMetrics();
    const totalSupply = supplyMetrics.totalSupply;
    const stakedSupply =
      supplyMetrics.delegatedSupply.base + supplyMetrics.delegatedSupply.delegated;
    const dexLiquiditySupply = supplyMetrics.unstakedSupply.dex;
    const communityPoolSupply = 0; // TODO: Get actual community pool supply

    // Use centralized calculation for token distribution breakdown
    const distributionBreakdown = calculateTokenDistributionBreakdown(
      totalSupply,
      stakedSupply,
      dexLiquiditySupply,
      communityPoolSupply
    );

    // Convert to the expected TokenDistribution format
    return [
      {
        category: "Staked",
        percentage: distributionBreakdown.staked.percentage,
        amount: distributionBreakdown.staked.amount,
        subcategories: [
          {
            name: "Validators",
            amount: supplyMetrics.delegatedSupply.base,
            percentage:
              stakedSupply > 0 ? (supplyMetrics.delegatedSupply.base / stakedSupply) * 100 : 0,
          },
          {
            name: "Delegators",
            amount: supplyMetrics.delegatedSupply.delegated,
            percentage:
              stakedSupply > 0 ? (supplyMetrics.delegatedSupply.delegated / stakedSupply) * 100 : 0,
          },
        ],
      },
      {
        category: "DEX Liquidity",
        percentage: distributionBreakdown.dexLiquidity.percentage,
        amount: distributionBreakdown.dexLiquidity.amount,
        subcategories: [
          {
            name: "PEN/USDC",
            amount: distributionBreakdown.dexLiquidity.amount * 0.6,
            percentage: 60,
          },
          {
            name: "PEN/ETH",
            amount: distributionBreakdown.dexLiquidity.amount * 0.4,
            percentage: 40,
          },
        ],
      },
      {
        category: "Community Pool",
        percentage: distributionBreakdown.communityPool.percentage,
        amount: distributionBreakdown.communityPool.amount,
      },
      {
        category: "Circulating",
        percentage: distributionBreakdown.circulating.percentage,
        amount: distributionBreakdown.circulating.amount,
      },
    ];
  }

  async getTokenMetrics(): Promise<TokenMetrics> {
    // Get actual metrics from centralized calculations
    const supplyMetrics = await this.getSupplyMetrics();
    const burnMetrics = await this.getBurnMetrics();
    const socialMetrics = await this.getSocialMetrics();

    return {
      totalSupply: supplyMetrics.totalSupply,
      circulatingSupply: socialMetrics.circulatingSupply,
      burnedTokens: burnMetrics.totalBurned,
      marketCap: socialMetrics.marketCap,
      price: socialMetrics.price,
    };
  }
}

// Optional: Export an instance if commonly used, or let consumers instantiate.
// export const pindexer = new Pindexer();
