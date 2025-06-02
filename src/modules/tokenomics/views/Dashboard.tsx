"use client";

import { useEffect, useRef, useState } from "react";

import Footer from "@/common/components/Footer";
import { shouldShowLiquidityTournament } from "@/lib/env/client";
import { useShare } from "@/lib/hooks/useShare";
import { shareConfigs } from "@/lib/utils/types";
import StickyNavbar from "@/modules/tokenomics/components/StickyNavbar";
import BurnMetricsSection from "@/modules/tokenomics/components/sections/BurnMetricsSection";
import IssuanceMetricsSection from "@/modules/tokenomics/components/sections/IssuanceMetricsSection";
import LiquidityTournamentSection from "@/modules/tokenomics/components/sections/LiquidityTournamentSection";
import SummarySection from "@/modules/tokenomics/components/sections/SummarySection";
import SupplyVisualizationSection from "@/modules/tokenomics/components/sections/SupplyVisualizationSection";
import TokenDistributionSection from "@/modules/tokenomics/components/sections/TokenDistributionSection";
import SharePreview from "@/modules/tokenomics/components/share/SharePreview";
import SharePreviewModal from "@/modules/tokenomics/components/share/SharePreviewModal";

export default function Dashboard() {
  const [showLQTSection, setShowLQTSection] = useState(false);
  const summaryShareRef = useRef<HTMLDivElement>(null);
  const [isContentLoading, setIsContentLoading] = useState(false);

  const {
    isSubmitting,
    handleShare,
    isPreviewOpen,
    previewData,
    handleClosePreview,
    handleConfirmShare,
  } = useShare({
    elementRef: summaryShareRef,
    shareConfig: shareConfigs.summary,
  });

  useEffect(() => {
    // Check environment variable on client-side only to prevent hydration mismatch
    setShowLQTSection(shouldShowLiquidityTournament());
  }, []);

  return (
    <>
      <StickyNavbar onShare={handleShare} isContentLoading={isContentLoading} />
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

      {/* Hidden SharePreview for image capture */}
      <div className="absolute -top-[9999px] left-0 pointer-events-none">
        <SharePreview ref={summaryShareRef} onAggregateLoadingChange={setIsContentLoading} />
      </div>

      {/* Share Preview Modal */}
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
