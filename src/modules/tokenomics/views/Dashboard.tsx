"use client";

import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import StickyNavbar from "@/modules/tokenomics/components/StickyNavbar";
// Import our card components
import {
  BurnMetricsCard,
  CirculatingSupplyCard,
  LQTMetricsCard,
  MarketCapCard,
  SupplyAllocationCard,
  TokenDistributionCard,
  TokenMetricsCard,
  TotalBurnedCard,
  TotalSupplyCard,
} from "@/modules/tokenomics/components/cards";
import { useGetSocialMetricsQuery } from "@/store/api/tokenomicsApi";

export default function Dashboard() {
  const { data: socialMetrics } = useGetSocialMetricsQuery();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Penumbra Tokenomics Dashboard",
        text: `Check out Penumbra's tokenomics! Total Supply: ${formatNumber(
          socialMetrics?.totalSupply || 0
        )}, Market Cap: $${formatNumber(socialMetrics?.marketCap || 0)}`,
        url: window.location.href,
      });
    }
  };

  return (
    <>
      <StickyNavbar />
      <div className="relative min-h-screen bg-background overflow-hidden">
        {/* Background effect - simplified */}
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat"></div>
        </div>
        {/* Main content */}
        <div className="relative z-10 min-h-screen">
          {/* Dashboard content */}
          <main className="p-6 container mx-auto">
            {/* Section: SUPPLY VISUALIZATION */}
            <section id="supply-visualization" className="mb-12 pt-16 -mt-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">SUPPLY VISUALIZATION</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="text-neutral-400 border-neutral-700 hover:bg-neutral-800 hover:text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              {/* Cards for this section will go here */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <TotalSupplyCard />
                {/* <CirculatingSupplyCard /> */}
                <MarketCapCard />
                <SupplyAllocationCard />
              </div>
            </section>

            {/* Section: ISSUANCE METRICS */}
            <section className="mb-12 pt-16 -mt-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">ISSUANCE METRICS</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="text-neutral-400 border-neutral-700 hover:bg-neutral-800 hover:text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              {/* Cards for this section will go here */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Placeholder for Current Issuance, Annual Issuance, Inflation */}
                {/* These will likely be new smaller cards or integrated into TokenMetricsCard later */}
              </div>
              <div className="grid grid-cols-1 gap-6">
                <TokenMetricsCard /> {/* Price History and other metrics */}
              </div>
            </section>

            {/* Section: BURN METRICS */}
            <section className="mb-12 pt-16 -mt-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">BURN METRICS</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="text-neutral-400 border-neutral-700 hover:bg-neutral-800 hover:text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              {/* Cards for this section will go here */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <BurnMetricsCard /> {/* Token burned by source chart */}
                {/* Placeholder for Total Burned, % of Total Supply, Why is burning important? */}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <TotalBurnedCard />
              </div>
              {/* Placeholder for Burn rate over time chart */}
            </section>

            {/* Section: TOKEN DISTRIBUTION */}
            <section className="mb-12 pt-16 -mt-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">TOKEN DISTRIBUTION</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="text-neutral-400 border-neutral-700 hover:bg-neutral-800 hover:text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              {/* Cards for this section will go here */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <CirculatingSupplyCard />
                {/* Placeholder for % Staked */}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <TokenDistributionCard />
              </div>
            </section>

            {/* Section: LIQUIDITY TOURNAMENT */}
            <section id="lqt" className="mb-12 pt-16 -mt-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">LIQUIDITY TOURNAMENT</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="text-neutral-400 border-neutral-700 hover:bg-neutral-800 hover:text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              {/* Cards for this section will go here */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Placeholders for Available Rewards, Delegator Rewards, LP Rewards, Total Voting Power */}
              </div>
              <div className="grid grid-cols-1 gap-6">
                <LQTMetricsCard /> {/* Positions table */}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
