"use client";

import Footer from "@/common/components/Footer";
import { formatNumber } from "@/lib/utils";
import StickyNavbar from "@/modules/tokenomics/components/StickyNavbar";
import BurnMetricsSection from "@/modules/tokenomics/components/sections/BurnMetricsSection";
import IssuanceMetricsSection from "@/modules/tokenomics/components/sections/IssuanceMetricsSection";
import LiquidityTournamentSection from "@/modules/tokenomics/components/sections/LiquidityTournamentSection";
import SummarySection from "@/modules/tokenomics/components/sections/SummarySection";
import SupplyVisualizationSection from "@/modules/tokenomics/components/sections/SupplyVisualizationSection";
import TokenDistributionSection from "@/modules/tokenomics/components/sections/TokenDistributionSection";
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
            <SummarySection handleShare={handleShare} />
            <SupplyVisualizationSection handleShare={handleShare} />
            <IssuanceMetricsSection handleShare={handleShare} />
            <BurnMetricsSection handleShare={handleShare} />
            <TokenDistributionSection handleShare={handleShare} />
            <LiquidityTournamentSection handleShare={handleShare} />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
