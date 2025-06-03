"use client";

import { useEffect, useState } from "react";

import Footer from "@/common/components/Footer";
import { shouldShowLiquidityTournament } from "@/lib/env/client";
import { SECTION_IDS } from "@/lib/types/sections";
import BurnMetricsSection from "@/modules/tokenomics/components/sections/BurnMetricsSection";
import IssuanceMetricsSection from "@/modules/tokenomics/components/sections/IssuanceMetricsSection";
import LiquidityTournamentSection from "@/modules/tokenomics/components/sections/LiquidityTournamentSection";
import SummarySection from "@/modules/tokenomics/components/sections/SummarySection";
import SupplyVisualizationSection from "@/modules/tokenomics/components/sections/SupplyVisualizationSection";
import TokenDistributionSection from "@/modules/tokenomics/components/sections/TokenDistributionSection";
import StickyNavbar from "@/modules/tokenomics/components/StickyNavbar";
import {
  SharePreviewProvider,
  useSharePreview,
} from "@/modules/tokenomics/context/SharePreviewContext";

function DashboardContent() {
  const [showLQTSection, setShowLQTSection] = useState(false);

  const {
    isSummaryPreviewLoading,
    isSupplyVisualizationPreviewLoading,
    isIssuanceMetricsPreviewLoading,
    isBurnMetricsPreviewLoading,
    isTokenDistributionPreviewLoading,
    isLiquidityTournamentPreviewLoading,
    summaryShareRef,
    supplyVisualizationShareRef,
    issuanceMetricsShareRef,
    burnMetricsShareRef,
    tokenDistributionShareRef,
    liquidityTournamentShareRef,
    handleShareRequest,
  } = useSharePreview();

  useEffect(() => {
    setShowLQTSection(shouldShowLiquidityTournament());
  }, []);

  return (
    <>
      <StickyNavbar
        onShare={() => handleShareRequest(SECTION_IDS.SUMMARY, summaryShareRef)}
        isContentLoading={isSummaryPreviewLoading}
      />
      <div className="relative min-h-screen bg-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat"></div>
        </div>
        <div className="relative z-10 min-h-screen">
          <main className="p-6 container mx-auto">
            <SummarySection />
            <SupplyVisualizationSection
              handleShare={() =>
                handleShareRequest(SECTION_IDS.SUPPLY_VISUALIZATION, supplyVisualizationShareRef)
              }
              isShareLoading={isSupplyVisualizationPreviewLoading}
            />
            <IssuanceMetricsSection
              handleShare={() =>
                handleShareRequest(SECTION_IDS.ISSUANCE_METRICS, issuanceMetricsShareRef)
              }
              isShareLoading={isIssuanceMetricsPreviewLoading}
            />
            <BurnMetricsSection
              handleShare={() => handleShareRequest(SECTION_IDS.BURN_METRICS, burnMetricsShareRef)}
              isShareLoading={isBurnMetricsPreviewLoading}
            />
            <TokenDistributionSection
              handleShare={() =>
                handleShareRequest(SECTION_IDS.TOKEN_DISTRIBUTION, tokenDistributionShareRef)
              }
              isShareLoading={isTokenDistributionPreviewLoading}
            />
            {showLQTSection && (
              <LiquidityTournamentSection
                handleShare={() => handleShareRequest(SECTION_IDS.LQT, liquidityTournamentShareRef)}
                isShareLoading={isLiquidityTournamentPreviewLoading}
              />
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function Dashboard() {
  return (
    <SharePreviewProvider>
      <DashboardContent />
    </SharePreviewProvider>
  );
}
