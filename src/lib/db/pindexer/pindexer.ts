import { Kysely } from "kysely";

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
  calculateTokenDistributionBreakdown,
  calculateTotalBurned,
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
  HistoricalBurnEntryRaw,
  LqtMetrics,
  PriceHistoryEntry,
  SummaryMetrics,
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
      currentHeight: 0, // Will be updated dynamically TODO: set height and timestamp and set ttls
      currentTimestamp: new Date(),
    };
  }

  async getSummaryMetrics(): Promise<SummaryMetrics> {
    const { startBlock: startHeight, endBlock: endHeight } =
      await this.blockService.getBlockRangeForDays(30);

    // Get insights
    const insightsPromise = this.supplyService.getInsightsSupply(endHeight.height);
    const insightsStartPromise = this.supplyService.getInsightsSupply(startHeight.height);
    // Get burn
    const burnsPromise = this.burnService.getTotalBurnsByHeight(endHeight.height);

    const [insights, insightsStart, burns] = await Promise.all([
      insightsPromise,
      insightsStartPromise,
      burnsPromise,
    ]);

    const totalSupply = Number(insights.totalSupply);
    const stakedTokens = Number(insights.stakedSupply);
    const marketCap = insights.marketCap ?? 0;
    const price = insights.price ?? 0;
    const inflationRate = calculateInflationRate(
      Number(insights.totalSupply),
      Number(insightsStart.totalSupply)
    );
    const totalBurned = calculateTotalBurned(
      burns.totalArbitrageBurns,
      burns.totalFeeBurns
    );

    return {
      totalSupply,
      stakedTokens,
      marketCap,
      price,
      inflationRate,
      totalBurned,
    };
  }

  async getSupplyMetrics(): Promise<SupplyMetrics> {
    const unstakedComponents: UnstakedSupplyComponents | null =
      await this.supplyService.getLatestUnstakedSupplyComponents();
    if (!unstakedComponents) {
      throw new Error("No unstaked components found");
    }

    const latestStakedHeight = await this.blockService.getLatestBlockDetails();

    const { totalSupply, stakedSupply } = await this.supplyService.getInsightsSupply(
      latestStakedHeight.height
    );

    // Use centralized calculations for supply components
    const totalUnstaked = calculateTotalUnstakedSupply(unstakedComponents);

    // Use centralized calculation for issuance since launch
    const { genesisAllocation } = this.calculationContext.config;
    const issuedSinceLaunch = calculateIssuanceSinceLaunch(Number(totalSupply), genesisAllocation);

    return {
      totalSupply: Number(totalSupply),
      totalStaked: Number(stakedSupply),
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
    };
  }

  async getBurnMetrics(): Promise<BurnMetrics> {
    const latestBurnSources: BurnSourcesData | null = await this.burnService.getLatestBurnSources();
    const { height: blockHeight } = await this.blockService.getLatestBlockDetails();

    if (!latestBurnSources || blockHeight === null) {
      return {
        totalBurned: 0,
        bySource: { arbitrageBurns: 0, feeBurns: 0 },
        burnRate: 0,
        historicalBurnRate: [],
      };
    }

    // Prepare burn data for centralized calculations - only permanent burns
    const currentBurnData: BurnData = {
      arbitrageBurns: latestBurnSources.arbitrageBurns,
      feeBurns: latestBurnSources.feeBurns,
      height: blockHeight,
      timestamp: new Date(),
    };

    // Get historical burn data
    const rawHistoricalBurns: HistoricalBurnEntryRaw[] =
      await this.burnService.getHistoricalBurnEntriesRaw(12);

    const historicalBurnData: BurnData[] = await Promise.all(
      rawHistoricalBurns.map(async (entry) => {
        const entryHeight = entry.height || "1";
        const timestamp = await this.blockService.getBlockTimestampByHeight(entryHeight);
        return {
          arbitrageBurns: entry.arbitrageBurns,
          feeBurns: entry.feeBurns,
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
    const stakedSupply = supplyMetrics.totalStaked;
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
    const { totalSupply, totalStaked, unstakedSupply } = await this.getSupplyMetrics();
    const { totalBurned: burnedTokens } = await this.getBurnMetrics();
    const { marketCap, price } = await this.getSummaryMetrics();
    const communityPoolSupply = 0; // TODO: Get actual community pool supply from https://buf.build/penumbra-zone/penumbra/docs/main:penumbra.core.component.community_pool.v1#penumbra.core.component.community_pool.v1.QueryService.CommunityPoolAssetBalances
    const circulatingSupply = calculateCirculatingSupply(
      totalSupply,
      totalStaked,
      unstakedSupply.dex,
      communityPoolSupply
    );

    return {
      totalSupply,
      circulatingSupply,
      burnedTokens,
      marketCap,
      price,
    };
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
}
