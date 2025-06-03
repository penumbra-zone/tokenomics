"use client";

import { useEffect, useRef, useState } from "react";

import Footer from "@/common/components/Footer";
import { shouldShowLiquidityTournament } from "@/lib/env/client";
import { useShare } from "@/lib/hooks/useShare";
import { SECTION_IDS, SectionId } from "@/lib/types/sections";
import { shareConfigs } from "@/lib/utils/types";
import BurnMetricsSection from "@/modules/tokenomics/components/sections/BurnMetricsSection";
import IssuanceMetricsSection from "@/modules/tokenomics/components/sections/IssuanceMetricsSection";
import LiquidityTournamentSection from "@/modules/tokenomics/components/sections/LiquidityTournamentSection";
import SummarySection from "@/modules/tokenomics/components/sections/SummarySection";
import SupplyVisualizationSection from "@/modules/tokenomics/components/sections/SupplyVisualizationSection";
import TokenDistributionSection from "@/modules/tokenomics/components/sections/TokenDistributionSection";
import SummarySharePreview from "@/modules/tokenomics/components/share/sections/SummarySharePreview";
import SharePreviewModal from "@/modules/tokenomics/components/share/SharePreviewModal";
import StickyNavbar from "@/modules/tokenomics/components/StickyNavbar";
import BurnMetricsSharePreview from "../components/share/sections/BurnMetricsSharePreview";
import IssuanceMetricsSharePreview from "../components/share/sections/IssuanceMetricsSharePreview";
import LiquidityTournamentSharePreview from "../components/share/sections/LiquidityTournamentSharePreview";
import SupplyVisualizationSharePreview from "../components/share/sections/SupplyVisualizationSharePreview";
import TokenDistributionSharePreview from "../components/share/sections/TokenDistributionSharePreview";

export default function Dashboard() {
  const [showLQTSection, setShowLQTSection] = useState(false);

  // Share preview loading states
  const [isSummaryPreviewLoading, setIsSummaryPreviewLoading] = useState(true);
  const [isSupplyVisualizationPreviewLoading, setIsSupplyVisualizationPreviewLoading] =
    useState(true);
  const [isIssuanceMetricsPreviewLoading, setIsIssuanceMetricsPreviewLoading] = useState(true);
  const [isBurnMetricsPreviewLoading, setIsBurnMetricsPreviewLoading] = useState(true);
  const [isTokenDistributionPreviewLoading, setIsTokenDistributionPreviewLoading] = useState(true);
  const [isLiquidityTournamentPreviewLoading, setIsLiquidityTournamentPreviewLoading] =
    useState(true);

  // Share preview refs
  const summaryShareRef = useRef<HTMLDivElement>(null);
  const supplyVisualizationShareRef = useRef<HTMLDivElement>(null);
  const issuanceMetricsShareRef = useRef<HTMLDivElement>(null);
  const burnMetricsShareRef = useRef<HTMLDivElement>(null);
  const tokenDistributionShareRef = useRef<HTMLDivElement>(null);
  const liquidityTournamentShareRef = useRef<HTMLDivElement>(null);

  const {
    isPreviewOpen,
    previewData,
    handleShare: triggerShareProcess,
    handleClosePreview,
    handleConfirmShare,
    isSubmitting,
  } = useShare();

  const handleShareRequest = (sectionId: SectionId, elementRef: React.RefObject<HTMLElement>) => {
    const config = shareConfigs[sectionId];
    if (elementRef.current && config) {
      triggerShareProcess({ elementRef, shareConfig: config });
    } else {
      console.error("Summary share configuration or ref not found.");
      alert("Failed to prepare summary share preview: configuration missing.");
    }
  };

  const handleSummaryPreviewLoadingChange = (isLoading: boolean, sectionId: SectionId) => {
    switch (sectionId) {
      case SECTION_IDS.SUMMARY:
        setIsSummaryPreviewLoading(isLoading);
        break;
      case SECTION_IDS.SUPPLY_VISUALIZATION:
        setIsSupplyVisualizationPreviewLoading(isLoading);
        break;
      case SECTION_IDS.ISSUANCE_METRICS:
        setIsIssuanceMetricsPreviewLoading(isLoading);
        break;
      case SECTION_IDS.BURN_METRICS:
        setIsBurnMetricsPreviewLoading(isLoading);
        break;
      case SECTION_IDS.TOKEN_DISTRIBUTION:
        setIsTokenDistributionPreviewLoading(isLoading);
        break;
      case SECTION_IDS.LQT:
        setIsLiquidityTournamentPreviewLoading(isLoading);
        break;
    }
  };

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

      <div className="absolute -top-[9999px] left-0 pointer-events-none">
        <SummarySharePreview
          ref={summaryShareRef}
          onAggregateLoadingChange={(isLoading) =>
            handleSummaryPreviewLoadingChange(isLoading, SECTION_IDS.SUMMARY)
          }
        />
        <SupplyVisualizationSharePreview
          ref={supplyVisualizationShareRef}
          onAggregateLoadingChange={(isLoading) =>
            handleSummaryPreviewLoadingChange(isLoading, SECTION_IDS.SUPPLY_VISUALIZATION)
          }
        />
        <IssuanceMetricsSharePreview
          ref={issuanceMetricsShareRef}
          onAggregateLoadingChange={(isLoading) =>
            handleSummaryPreviewLoadingChange(isLoading, SECTION_IDS.ISSUANCE_METRICS)
          }
        />
        <BurnMetricsSharePreview
          ref={burnMetricsShareRef}
          onAggregateLoadingChange={(isLoading) =>
            handleSummaryPreviewLoadingChange(isLoading, SECTION_IDS.BURN_METRICS)
          }
        />
        <TokenDistributionSharePreview
          ref={tokenDistributionShareRef}
          onAggregateLoadingChange={(isLoading) =>
            handleSummaryPreviewLoadingChange(isLoading, SECTION_IDS.TOKEN_DISTRIBUTION)
          }
        />
        <LiquidityTournamentSharePreview
          ref={liquidityTournamentShareRef}
          onAggregateLoadingChange={(isLoading) =>
            handleSummaryPreviewLoadingChange(isLoading, SECTION_IDS.LQT)
          }
        />
      </div>

      <SharePreviewModal
        isOpen={isPreviewOpen}
        previewData={previewData}
        onClose={handleClosePreview}
        onShareToX={handleConfirmShare}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
