"use client";

import Footer from "@/common/components/Footer";
import { shouldShowLiquidityTournament } from "@/lib/env/client";
import StickyNavbar from "@/modules/tokenomics/components/StickyNavbar";
import BurnMetricsSection from "@/modules/tokenomics/components/sections/BurnMetricsSection";
import IssuanceMetricsSection from "@/modules/tokenomics/components/sections/IssuanceMetricsSection";
import LiquidityTournamentSection from "@/modules/tokenomics/components/sections/LiquidityTournamentSection";
import SummarySection from "@/modules/tokenomics/components/sections/SummarySection";
import SupplyVisualizationSection from "@/modules/tokenomics/components/sections/SupplyVisualizationSection";
import TokenDistributionSection from "@/modules/tokenomics/components/sections/TokenDistributionSection";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const handleShare = () => {};
  const [showLQTSection, setShowLQTSection] = useState(false);

  useEffect(() => {
    // Check environment variable on client-side only to prevent hydration mismatch
    setShowLQTSection(shouldShowLiquidityTournament());
  }, []);

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
            {showLQTSection && <LiquidityTournamentSection handleShare={handleShare} />}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
