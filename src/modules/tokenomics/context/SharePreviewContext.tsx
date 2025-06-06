"use client";

import { useShare } from "@/lib/hooks/useShare";
import { SectionId } from "@/lib/types/sections";
import { shareConfigs } from "@/lib/utils/types";
import React, {
  createContext,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { SharePreviewModal } from "../components/share";

interface SharePreviewContextType {
  // Loading state
  isPreviewLoading: boolean;

  // Ref
  sharePreviewRef: RefObject<HTMLDivElement>;

  // Functions
  handleShareRequest: (elementRef: RefObject<HTMLElement>) => void;
  handlePreviewLoadingChange: (isLoading: boolean) => void;
}

const SharePreviewContext = createContext<SharePreviewContextType | undefined>(undefined);

export const useSharePreview = () => {
  const context = useContext(SharePreviewContext);
  if (!context) {
    throw new Error("useSharePreview must be used within a SharePreviewProvider");
  }
  return context;
};

interface SharePreviewProps {
  onAggregateLoadingChange?: (isLoading: boolean) => void;
}

interface SharePreviewProviderProps {
  children: ReactNode;
  sectionId: SectionId;
  SharePreviewComponent: ForwardRefExoticComponent<
    SharePreviewProps & RefAttributes<HTMLDivElement>
  >;
}

export const SharePreviewProvider: React.FC<SharePreviewProviderProps> = ({
  children,
  sectionId,
  SharePreviewComponent,
}) => {
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const sharePreviewRef = useRef<HTMLDivElement>(null);

  const {
    isGeneratingImage,
    isPreviewOpen,
    previewData,
    handleClosePreview,
    handleConfirmShare,
    isSubmitting,
    handleShare: triggerShareProcess,
  } = useShare();

  const handleShareRequest = useCallback(
    (elementRef: React.RefObject<HTMLElement>) => {
      const config = shareConfigs[sectionId];
      if (elementRef.current && config) {
        triggerShareProcess({ elementRef, shareConfig: config });
      } else {
        console.error(`Share configuration or ref not found for section ${sectionId}.`);
        alert(`Failed to prepare share preview for ${sectionId}: configuration missing.`);
      }
    },
    [sectionId, triggerShareProcess]
  );

  const handlePreviewLoadingChange = useCallback(
    (isLoading: boolean) => {
      setIsPreviewLoading(isLoading);
    },
    [setIsPreviewLoading]
  );

  const contextValue = useMemo(
    () => ({
      isPreviewLoading: isPreviewLoading || isGeneratingImage,
      sharePreviewRef,
      handleShareRequest,
      handlePreviewLoadingChange,
    }),
    [
      isPreviewLoading,
      isGeneratingImage,
      sharePreviewRef,
      handleShareRequest,
      handlePreviewLoadingChange,
    ]
  );

  return (
    <SharePreviewContext.Provider value={contextValue}>
      <div className="absolute -top-[9999px] left-0 pointer-events-none">
        <SharePreviewComponent
          ref={sharePreviewRef}
          onAggregateLoadingChange={handlePreviewLoadingChange}
        />
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
