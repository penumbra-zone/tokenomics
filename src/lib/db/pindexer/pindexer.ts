import { AssetId } from "@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb";
import { Kysely } from "kysely";

import { registryClient } from "@/lib/registry";
import {
  calculateBurnMetrics,
  calculateBurnRateTimeSeries,
  calculateCirculatingSupply,
  calculateInflationRate,
  calculateInflationTimeSeries,
  calculateIssuanceMetrics,
  calculateIssuanceSinceLaunch,
  calculateTokenDistributionBreakdown,
  calculateTotalUnstakedSupply,
  CalculationContext,
  getCurrentNetworkConfig,
  SupplyData,
} from "../../calculations";
import { getDateRangeForDays, getDurationWindowForDays } from "../utils";
import { dbClient as defaultDb } from "./client";
import { MockPindexerConnection } from "./mock/mock-pindexer-connection";
import { DB } from "./schema";
import { BlockService } from "./services/block_service";
import { BurnService } from "./services/burn_service";
import { MarketService } from "./services/market_service";
import { SupplyService } from "./services/supply_service";
import {
  AbstractPindexerConnection,
  BurnDataBySource,
  BurnMetrics,
  DurationWindow,
  InflationTimeSeries,
  IssuanceMetrics,
  LqtMetrics,
  PriceHistoryResult,
  SummaryMetrics,
  SupplyMetrics,
  TokenDistribution,
  TokenMetrics,
  UnstakedSupplyComponents,
} from "./types";
import { AssetMetadataMap } from './services/base_service';
import { formatAssetAmount } from '@/lib/registry/utils';

export class Pindexer extends AbstractPindexerConnection {
  private readonly blockService: BlockService;
  private readonly marketService: MarketService;
  private readonly supplyService: SupplyService;
  private readonly burnService: BurnService;
  private readonly calculationContext: CalculationContext;
  private readonly metadataMap: AssetMetadataMap;

  constructor(metadataMap: AssetMetadataMap, protected dbInstance: Kysely<DB> = defaultDb) {
    super();
    this.metadataMap = metadataMap;
    this.blockService = new BlockService(dbInstance, metadataMap);
    this.marketService = new MarketService(dbInstance, metadataMap);
    this.supplyService = new SupplyService(dbInstance, metadataMap);
    this.burnService = new BurnService(dbInstance, metadataMap);

    // Initialize calculation context with current network config
    const config = getCurrentNetworkConfig();
    this.calculationContext = {
      config,
      currentHeight: 0, // Will be updated dynamically
      currentTimestamp: new Date(),
    };
  }

  async getSummaryMetrics(): Promise<SummaryMetrics> {
    const { startBlock: startHeight, endBlock: endHeight } =
      await this.blockService.getBlockRangeForDays(30);
    const endDateLastMonth = new Date();
    endDateLastMonth.setDate(endDateLastMonth.getDate() - 30);
    const { startBlock: startHeightLastMonth } = await this.blockService.getBlockRangeForDays(
      30,
      endDateLastMonth
    );

    // Get insights
    const insightsPromise = this.supplyService.getInsightsSupply(endHeight.height);
    const insightsStartPromise = this.supplyService.getInsightsSupply(startHeight.height);
    const insightsStartLastMonthPromise = this.supplyService.getInsightsSupply(
      startHeightLastMonth.height
    );
    // Get burn
    const burnsPromise = this.burnService.getTotalBurnsByHeight(endHeight.height);

    const [insights, insightsStart, insightsStartLastMonth, burns] = await Promise.all([
      insightsPromise,
      insightsStartPromise,
      insightsStartLastMonthPromise,
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
    const inflationRateLastMonth = calculateInflationRate(
      Number(insightsStart.totalSupply),
      Number(insightsStartLastMonth.totalSupply)
    );

    return {
      totalSupply,
      stakedTokens,
      marketCap,
      price,
      inflation: {
        current: inflationRate,
        lastMonth: inflationRateLastMonth,
      },
      totalBurned: burns.totalBurned,
    };
  }

  async getIssuanceMetrics(): Promise<IssuanceMetrics> {
    const { currentIssuance, projectedAnnualIssuance } = calculateIssuanceMetrics(
      this.calculationContext
    );
    return { 
      currentIssuance: Number(formatAssetAmount(BigInt(currentIssuance), this.metadataMap.um)), 
      annualIssuance: Number(formatAssetAmount(BigInt(projectedAnnualIssuance), this.metadataMap.um)) 
    };
  }

  async getInflationTimeSeries(days: number): Promise<InflationTimeSeries> {
    const { startDate, endDate } = getDateRangeForDays(days);
    const window = getDurationWindowForDays(days);

    // Get historical supply data with appropriate window
    const historicalSupplyData = await this.supplyService.getHistoricalSupplyData(
      startDate,
      endDate,
      window
    );

    // Convert to SupplyData format for calculations
    const supplyDataPoints: SupplyData[] = historicalSupplyData.map((entry) => ({
      total: entry.total,
      staked: entry.staked,
      height: entry.height,
      timestamp: entry.timestamp,
    }));

    // Calculate inflation time series using centralized calculation
    const timeSeries = calculateInflationTimeSeries(supplyDataPoints);

    return { timeSeries };
  }

  async getSupplyMetrics(): Promise<SupplyMetrics> {
    const unstakedComponents: UnstakedSupplyComponents | null =
      await this.supplyService.getLatestUnstakedSupplyComponents();
    if (!unstakedComponents) {
      throw new Error("No unstaked components found");
    }

    const latestStakedHeight = await this.blockService.getLatestBlockDetails(
      this.calculationContext
    );

    const { totalSupply, stakedSupply } = await this.supplyService.getInsightsSupply(
      latestStakedHeight.height
    );

    // Use centralized calculations for supply components
    const totalUnstaked = calculateTotalUnstakedSupply(unstakedComponents);

    // Use centralized calculation for issuance since launch
    const genesisAllocation = Number(formatAssetAmount(BigInt(this.calculationContext.config.genesisAllocation), this.metadataMap.um));
    const issuedSinceLaunch = calculateIssuanceSinceLaunch(Number(totalSupply), genesisAllocation);

    return {
      totalSupply: Number(totalSupply),
      totalStaked: Number(stakedSupply),
      totalUnstaked,
      genesisAllocation,
      issuedSinceLaunch,
      unstakedSupply: {
        base: Number(unstakedComponents.um),
        auction: Number(unstakedComponents.auction),
        dex: Number(unstakedComponents.dex),
        arbitrage: Number(unstakedComponents.arb),
        fees: Number(unstakedComponents.fees),
      },
    };
  }

  async getBurnMetrics(days: number): Promise<BurnMetrics> {
    const { height: blockHeight } = await this.blockService.getLatestBlockDetails(
      this.calculationContext
    );

    const burnDataBySource: BurnDataBySource = await this.burnService.getBurnDataBySource();

    const totalSupply = Number(
      (await this.supplyService.getInsightsSupply(blockHeight)).totalSupply
    );
    const burnMetrics = calculateBurnMetrics(
      burnDataBySource,
      totalSupply,
      this.calculationContext
    );

    // Calculate date range and window for burn metrics time series
    const { startDate, endDate } = getDateRangeForDays(days);
    const window = getDurationWindowForDays(days);

    const burnDataByDay = await this.burnService.getBurnMetricsTimeSeries(
      startDate,
      endDate,
      window
    );
    const historicalBurnRate = calculateBurnRateTimeSeries(burnDataByDay);

    return {
      totalBurned: burnMetrics.totalBurned,
      bySource: burnDataBySource,
      burnRate: burnMetrics.burnRatePerDay,
      historicalBurnRate,
    };
  }

  async getPriceHistory(params: {
    baseAsset: AssetId;
    quoteAsset: AssetId;
    chainId: string;
    days?: number;
    window?: DurationWindow;
  }): Promise<PriceHistoryResult> {
    return await this.marketService.getPriceHistory(params);
  }

  async getTokenDistribution(): Promise<TokenDistribution[]> {
    const supplyMetrics = await this.getSupplyMetrics();
    const totalSupply = supplyMetrics.totalSupply;
    const stakedSupply = supplyMetrics.totalStaked;
    const dexLiquiditySupply = supplyMetrics.unstakedSupply.dex;
    const communityPoolSupply = await this.getCommunityPoolSupply();

    const distributionBreakdown = calculateTokenDistributionBreakdown(
      totalSupply,
      stakedSupply,
      dexLiquiditySupply,
      communityPoolSupply
    );

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
    const { totalSupply, totalStaked, unstakedSupply } = await this.getSupplyMetrics();
    const { totalBurned: burnedTokens } = await this.getBurnMetrics(0);
    const { marketCap, price } = await this.getSummaryMetrics();
    const communityPoolSupply = await this.getCommunityPoolSupply();
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

  async getCommunityPoolSupply(): Promise<number> {
    try {
      const { stakingAssetId } = registryClient.bundled.globals();
      return Number(await this.supplyService.getCommunityPoolSupply([stakingAssetId]));
    } catch (error) {
      console.error("Failed to fetch community pool supply:", error);
      throw error;
    }
  }

  async getLqtMetrics(): Promise<LqtMetrics> {
    // TODO: Implement with Kysely if LQT tables are in the schema, or keep as mock
    return new MockPindexerConnection().getLqtMetrics();
  }
}
