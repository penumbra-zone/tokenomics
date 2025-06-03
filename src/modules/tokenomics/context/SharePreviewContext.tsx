"use client";

import { shouldShowLiquidityTournament } from "@/lib/env/client";
import { useShare } from "@/lib/hooks/useShare";
import { SECTION_IDS, SectionId } from "@/lib/types/sections";
import { shareConfigs } from "@/lib/utils/types";
import BurnMetricsSharePreview from "@/modules/tokenomics/components/share/sections/BurnMetricsSharePreview";
import IssuanceMetricsSharePreview from "@/modules/tokenomics/components/share/sections/IssuanceMetricsSharePreview";
import LiquidityTournamentSharePreview from "@/modules/tokenomics/components/share/sections/LiquidityTournamentSharePreview";
import SummarySharePreview from "@/modules/tokenomics/components/share/sections/SummarySharePreview";
import SupplyVisualizationSharePreview from "@/modules/tokenomics/components/share/sections/SupplyVisualizationSharePreview";
import TokenDistributionSharePreview from "@/modules/tokenomics/components/share/sections/TokenDistributionSharePreview";
import React, {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SharePreviewModal } from "../components/share";

// Infer ShareConfig type if not explicitly exported
type ShareConfigValue = (typeof shareConfigs)[SectionId];

interface SharePreviewContextType {
  // Loading states
  isSummaryPreviewLoading: boolean;
  isSupplyVisualizationPreviewLoading: boolean;
  isIssuanceMetricsPreviewLoading: boolean;
  isBurnMetricsPreviewLoading: boolean;
  isTokenDistributionPreviewLoading: boolean;
  isLiquidityTournamentPreviewLoading: boolean;

  // Refs
  summaryShareRef: RefObject<HTMLDivElement>;
  supplyVisualizationShareRef: RefObject<HTMLDivElement>;
  issuanceMetricsShareRef: RefObject<HTMLDivElement>;
  burnMetricsShareRef: RefObject<HTMLDivElement>;
  tokenDistributionShareRef: RefObject<HTMLDivElement>;
  liquidityTournamentShareRef: RefObject<HTMLDivElement>;

  // Functions
  handleShareRequest: (sectionId: SectionId, elementRef: RefObject<HTMLElement>) => void;
  handleSummaryPreviewLoadingChange: (isLoading: boolean, sectionId: SectionId) => void;
}

const SharePreviewContext = createContext<SharePreviewContextType | undefined>(undefined);

export const useSharePreview = () => {
  const context = useContext(SharePreviewContext);
  if (!context) {
    throw new Error("useSharePreview must be used within a SharePreviewProvider");
  }
  return context;
};

interface SharePreviewProviderProps {
  children: ReactNode;
}

export const SharePreviewProvider: React.FC<SharePreviewProviderProps> = ({ children }) => {
  const [isSummaryPreviewLoading, setIsSummaryPreviewLoading] = useState(true);
  const [isSupplyVisualizationPreviewLoading, setIsSupplyVisualizationPreviewLoading] =
    useState(true);
  const [isIssuanceMetricsPreviewLoading, setIsIssuanceMetricsPreviewLoading] = useState(true);
  const [isBurnMetricsPreviewLoading, setIsBurnMetricsPreviewLoading] = useState(true);
  const [isTokenDistributionPreviewLoading, setIsTokenDistributionPreviewLoading] = useState(true);
  const [isLiquidityTournamentPreviewLoading, setIsLiquidityTournamentPreviewLoading] =
    useState(true);
  const [showLQTSectionPreview, setShowLQTSectionPreview] = useState(false);

  const summaryShareRef = useRef<HTMLDivElement>(null);
  const supplyVisualizationShareRef = useRef<HTMLDivElement>(null);
  const issuanceMetricsShareRef = useRef<HTMLDivElement>(null);
  const burnMetricsShareRef = useRef<HTMLDivElement>(null);
  const tokenDistributionShareRef = useRef<HTMLDivElement>(null);
  const liquidityTournamentShareRef = useRef<HTMLDivElement>(null);

  const {
    isPreviewOpen,
    previewData,
    handleClosePreview,
    handleConfirmShare,
    isSubmitting,
    handleShare: triggerShareProcess,
  } = useShare();

  useEffect(() => {
    setShowLQTSectionPreview(shouldShowLiquidityTournament());
  }, []);

  const handleShareRequest = (sectionId: SectionId, elementRef: React.RefObject<HTMLElement>) => {
    const config = shareConfigs[sectionId];
    if (elementRef.current && config) {
      triggerShareProcess({ elementRef, shareConfig: config });
    } else {
      console.error(`Share configuration or ref not found for section ${sectionId}.`);
      alert(`Failed to prepare share preview for ${sectionId}: configuration missing.`);
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

  return (
    <SharePreviewContext.Provider
      value={{
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
        handleSummaryPreviewLoadingChange,
      }}
    >
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
        {showLQTSectionPreview && (
          <LiquidityTournamentSharePreview
            ref={liquidityTournamentShareRef}
            onAggregateLoadingChange={(isLoading) =>
              handleSummaryPreviewLoadingChange(isLoading, SECTION_IDS.LQT)
            }
          />
        )}
      </div>
      {children}

      <SharePreviewModal
        isOpen={isPreviewOpen}
        previewData={previewData}
        onClose={handleClosePreview}
        onShareToX={handleConfirmShare}
        isSubmitting={isSubmitting}
      />
    </SharePreviewContext.Provider>
  );
};
