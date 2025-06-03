"use client";

import { prepareSharePreview, shareToTwitter } from "@/lib/utils/shareUtils";
import { ShareConfigEntry, SharePreviewData } from "@/lib/utils/types";
import { useCallback, useState } from "react";

interface HandleShareOptions {
  elementRef: React.RefObject<HTMLElement>;
  shareConfig: ShareConfigEntry;
}

interface UseShareReturn {
  isGeneratingImage: boolean;
  isPreviewOpen: boolean;
  previewData: SharePreviewData | null;
  handleShare: (details: HandleShareOptions) => Promise<void>;
  handleClosePreview: () => void;
  handleConfirmShare: () => Promise<void>;
  isSubmitting: boolean;
}

export function useShare(): UseShareReturn {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<SharePreviewData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShare = useCallback(async (details: HandleShareOptions) => {
    setIsGeneratingImage(true);

    try {
      const success = await prepareSharePreview({
        elementRef: details.elementRef,
        shareConfig: details.shareConfig,
        onShowPreview: (data) => {
          setPreviewData(data);
          setIsPreviewOpen(true);
        },
      });

      if (!success) {
        alert("Failed to prepare share preview");
      }
    } catch (error) {
      alert("An unexpected error occurred while trying to share to X. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  }, []);

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setPreviewData(null);
  }, []);

  const handleConfirmShare = useCallback(async () => {
    if (!previewData) return;

    setIsSubmitting(true);
    try {
      const success = await shareToTwitter(previewData);
      if (success) {
        handleClosePreview();
      }
    } catch (error) {
      console.error("Share error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [previewData, handleClosePreview]);

  return {
    isGeneratingImage,
    isPreviewOpen,
    previewData,
    handleShare,
    handleClosePreview,
    handleConfirmShare,
    isSubmitting,
  };
}
