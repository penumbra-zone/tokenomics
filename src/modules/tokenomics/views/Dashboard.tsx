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
  CardDescription,
} from "@/common/components/ui/Card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Share2,
  CircleDollarSign,
  Wallet,
  Menu,
  Coins,
  GanttChartSquare,
  PieChart,
  LineChart,
  Lock,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import Image from "next/image";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-amber-900/20"></div>
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-1/2 h-1/2 rounded-full bg-amber-700/10 blur-3xl"></div>
      </div>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-background/90 backdrop-blur-lg border-r border-border transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="relative w-full h-24 border-b border-border bg-gradient-to-r to-primary/40 from-black">
            <Image
              src="/penumbra-logo.svg"
              alt="Penumbra Logo"
              fill
              className="object-contain p-4"
              priority
            />
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm rounded-md bg-primary/20 text-primary group"
            >
              <GanttChartSquare className="mr-3 h-5 w-5" />
              <span>Dashboard</span>
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors group"
            >
              <PieChart className="mr-3 h-5 w-5" />
              <span>Distribution</span>
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors group"
            >
              <LineChart className="mr-3 h-5 w-5" />
              <span>Price History</span>
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors group"
            >
              <Lock className="mr-3 h-5 w-5" />
              <span>Vesting</span>
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors group"
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              <span>Analytics</span>
            </a>
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <ThemeSwitcher />
              <a
                href="#"
                className="flex items-center text-sm text-primary hover:text-primary/80"
              >
                <span className="mr-1">Docs</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 md:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/50 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold text-foreground">
              Tokenomics Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/50 text-primary hover:bg-primary/20 hover:text-primary/80"
                    >
                      <CircleDollarSign className="h-4 w-4 mr-2" />
                      <span>${socialMetrics?.price.toFixed(2)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current token price</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="border-primary/50 text-primary hover:bg-primary/20 hover:text-primary/80"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          {/* Overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-background/60 border-border backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-primary text-lg">
                  Total Supply
                </CardTitle>
                <CardDescription>Maximum token supply</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {supply?.totalSupply.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Genesis: {supply?.genesisAllocation.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/60 border-border backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-primary text-lg">
                  Circulating Supply
                </CardTitle>
                <CardDescription>Currently in circulation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {circulatingSupply.toLocaleString()}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground">
                    {(
                      (circulatingSupply / (supply?.totalSupply || 1)) *
                      100
                    ).toFixed(1)}
                    % of total
                  </div>
                </div>
                <Progress
                  value={(circulatingSupply / (supply?.totalSupply || 1)) * 100}
                  className="h-1 mt-2"
                />
              </CardContent>
            </Card>

            <Card className="bg-background/60 border-border backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-primary text-lg">
                  Market Cap
                </CardTitle>
                <CardDescription>Current valuation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${socialMetrics?.marketCap.toLocaleString()}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground">
                    Price: ${socialMetrics?.price.toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/60 border-border backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-primary text-lg">
                  Total Burned
                </CardTitle>
                <CardDescription>Tokens removed from supply</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {burnMetrics?.totalBurned.toLocaleString()}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground">
                    Rate: {burnMetrics?.burnRate.toFixed(4)}/block
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-background/60 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary">
                  Supply Allocation
                </CardTitle>
                <CardDescription>Genesis vs Issued tokens</CardDescription>
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

            <Card className="bg-background/60 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary">Inflation Rate</CardTitle>
                <CardDescription>Token inflation over time</CardDescription>
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
            <Card className="bg-background/60 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary">
                  Token Distribution
                </CardTitle>
                <CardDescription>
                  Allocation of total token supply
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <TokenDistributionChart data={distribution || []} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/60 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary">Burn Metrics</CardTitle>
                <CardDescription>Token burn by source</CardDescription>
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
            <Card className="bg-background/60 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary">Price History</CardTitle>
                <CardDescription>Token price over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <PriceHistoryChart data={priceHistory || []} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/60 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary">
                  Liquidity Tournament Metrics
                </CardTitle>
                <CardDescription>LQT rewards and voting power</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Available Rewards
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {lqtMetrics?.availableRewards.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Voting Power
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {lqtMetrics?.votingPower.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Delegator Rewards
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {lqtMetrics?.delegatorRewards.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        LP Rewards
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {lqtMetrics?.lpRewards.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
