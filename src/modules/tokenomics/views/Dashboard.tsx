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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

// Import our card components
import {
  TotalSupplyCard,
  CirculatingSupplyCard,
  MarketCapCard,
  TotalBurnedCard,
  SupplyAllocationCard,
  BurnMetricsCard,
  TokenDistributionCard,
  LQTMetricsCard,
  TokenMetricsCard,
} from "@/modules/tokenomics/components/cards";

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
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-1/2 h-1/2 rounded-full bg-secondary/10 blur-3xl"></div>
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
          <div className="relative w-full h-24 border-b border-border bg-background">
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
            <div className="flex items-center justify-end">
              <a
                href="https://guide.penumbra.zone/"
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
            <TotalSupplyCard
              totalSupply={supply?.totalSupply || 0}
              genesisAllocation={supply?.genesisAllocation || 0}
            />

            <CirculatingSupplyCard
              circulatingSupply={circulatingSupply}
              totalSupply={supply?.totalSupply || 0}
            />

            <MarketCapCard
              marketCap={socialMetrics?.marketCap || 0}
              price={socialMetrics?.price || 0}
            />

            <TotalBurnedCard
              totalBurned={burnMetrics?.totalBurned || 0}
              burnRate={burnMetrics?.burnRate || 0}
            />
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SupplyAllocationCard
              genesisAllocation={supply?.genesisAllocation || 0}
              issuedSinceLaunch={supply?.issuedSinceLaunch || 0}
            />

            <BurnMetricsCard data={burnMetrics || defaultBurnMetrics} />
          </div>

          {/* Distribution and Burn Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TokenDistributionCard data={distribution || []} />

            <LQTMetricsCard
              data={
                lqtMetrics || {
                  availableRewards: 0,
                  votingPower: { total: 0 },
                  delegatorRewards: 0,
                  lpRewards: 0,
                }
              }
            />
          </div>

          {/* Price History and Inflation Rate */}
          <div className="grid grid-cols-1 gap-6">
            <TokenMetricsCard
              priceHistoryData={priceHistory || []}
              inflationRateData={priceHistory || []}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
