"use client";

import {
  useGetSupplyMetricsQuery,
  useGetTokenDistributionQuery,
  useGetPriceHistoryQuery,
  useGetBurnMetricsQuery,
  useGetLQTMetricsQuery,
  useGetSocialMetricsQuery,
  BurnMetrics,
} from "@/store/api/tokenomicsApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/Card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

// Create client-side only chart components
const TokenDistributionChart = dynamic(
  () => import("@/modules/tokenomics/components/TokenDistributionChart"),
  { ssr: false }
);

const PriceHistoryChart = dynamic(
  () => import("@/modules/tokenomics/components/PriceHistoryChart"),
  { ssr: false }
);

const SupplyAllocationChart = dynamic(
  () => import("@/modules/tokenomics/components/SupplyAllocationChart"),
  { ssr: false }
);

const BurnMetricsChart = dynamic(
  () => import("@/modules/tokenomics/components/BurnMetricsChart"),
  { ssr: false }
);

const InflationRateChart = dynamic(
  () => import("@/modules/tokenomics/components/InflationRateChart"),
  { ssr: false }
);

export default function Dashboard() {
  const {
    data: supply,
    isLoading: supplyLoading,
    error: supplyError,
  } = useGetSupplyMetricsQuery();
  const {
    data: distribution,
    isLoading: distributionLoading,
    error: distributionError,
  } = useGetTokenDistributionQuery();
  const {
    data: priceHistory,
    isLoading: priceHistoryLoading,
    error: priceHistoryError,
  } = useGetPriceHistoryQuery();
  const {
    data: burnMetrics,
    isLoading: burnLoading,
    error: burnError,
  } = useGetBurnMetricsQuery();
  const {
    data: lqtMetrics,
    isLoading: lqtLoading,
    error: lqtError,
  } = useGetLQTMetricsQuery();
  const {
    data: socialMetrics,
    isLoading: socialLoading,
    error: socialError,
  } = useGetSocialMetricsQuery();

  const isLoading =
    supplyLoading ||
    distributionLoading ||
    priceHistoryLoading ||
    burnLoading ||
    lqtLoading ||
    socialLoading;
  const hasError =
    supplyError ||
    distributionError ||
    priceHistoryError ||
    burnError ||
    lqtError ||
    socialError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">Error loading dashboard data</div>
      </div>
    );
  }

  const handleShare = () => {
    // Implement social sharing functionality
    if (navigator.share) {
      navigator.share({
        title: "Penumbra Tokenomics Dashboard",
        text: `Check out Penumbra's tokenomics! Total Supply: ${socialMetrics?.totalSupply.toLocaleString()}, Market Cap: $${socialMetrics?.marketCap.toLocaleString()}`,
        url: window.location.href,
      });
    }
  };

  const circulatingSupply =
    supply?.totalSupply && supply?.unstakedSupply?.base
      ? supply.totalSupply - supply.unstakedSupply.base
      : 0;

  const defaultBurnMetrics: BurnMetrics = {
    totalBurned: 0,
    bySource: {
      transactionFees: 0,
      dexArbitrage: 0,
      auctionBurns: 0,
      dexBurns: 0,
    },
    burnRate: 0,
    historicalBurnRate: [],
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Penumbra Tokenomics Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button onClick={handleShare} variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <ThemeSwitcher />
        </div>
      </div>

      {/* Supply Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {supply?.totalSupply.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Genesis: {supply?.genesisAllocation.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Circulating Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {circulatingSupply.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${socialMetrics?.marketCap.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Burned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {burnMetrics?.totalBurned.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Rate: {burnMetrics?.burnRate.toFixed(2)}/block
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Supply Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <SupplyAllocationChart
                genesisAllocation={supply?.genesisAllocation || 0}
                issuedSinceLaunch={supply?.issuedSinceLaunch || 0}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inflation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <InflationRateChart data={priceHistory || []} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution and Burn Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Token Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <TokenDistributionChart data={distribution || []} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Burn Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <BurnMetricsChart data={burnMetrics || defaultBurnMetrics} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price History and LQT Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <PriceHistoryChart data={priceHistory || []} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liquidity Tournament Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Available Rewards
                  </p>
                  <p className="text-xl font-bold">
                    {lqtMetrics?.availableRewards.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Voting Power
                  </p>
                  <p className="text-xl font-bold">
                    {lqtMetrics?.votingPower.total.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Delegator Rewards
                  </p>
                  <p className="text-xl font-bold">
                    {lqtMetrics?.delegatorRewards.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">LP Rewards</p>
                  <p className="text-xl font-bold">
                    {lqtMetrics?.lpRewards.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
