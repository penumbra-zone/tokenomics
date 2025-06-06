"use client";

import { useEffect, useState } from "react";

import Footer from "@/common/components/Footer";
import { shouldShowLiquidityTournament } from "@/lib/env/client";
import BurnMetricsSection from "@/modules/tokenomics/components/sections/BurnMetricsSection";
import IssuanceMetricsSection from "@/modules/tokenomics/components/sections/IssuanceMetricsSection";
import LiquidityTournamentSection from "@/modules/tokenomics/components/sections/LiquidityTournamentSection";
import SummarySection from "@/modules/tokenomics/components/sections/SummarySection";
import SupplyVisualizationSection from "@/modules/tokenomics/components/sections/SupplyVisualizationSection";
import TokenDistributionSection from "@/modules/tokenomics/components/sections/TokenDistributionSection";
import StickyNavbar from "@/modules/tokenomics/components/StickyNavbar";

export default function Dashboard() {
  const [showLQTSection, setShowLQTSection] = useState(false);

  useEffect(() => {
    setShowLQTSection(shouldShowLiquidityTournament());
  }, []);

  return (
    <>
      <StickyNavbar />
      <div className="relative min-h-screen bg-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat"></div>
        </div>
        <div className="relative z-10 min-h-screen">
          <main className="p-6 container mx-auto">
            <SummarySection />
            <SupplyVisualizationSection />
            <IssuanceMetricsSection />
            <BurnMetricsSection />
            <TokenDistributionSection />
            {showLQTSection && <LiquidityTournamentSection />}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
