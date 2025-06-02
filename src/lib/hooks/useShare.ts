"use client";

import type { SectionId } from "@/lib/types/sections";
import { prepareSharePreview, SharePreviewData, shareToTwitter } from "@/lib/utils/shareUtils";
import { useCallback, useState } from "react";

interface UseShareOptions {
  elementRef: React.RefObject<HTMLElement>;
  fileName: string;
  twitterText: string;
  sectionName: string;
  sectionId: SectionId;
}

interface UseShareReturn {
  isGeneratingImage: boolean;
  isPreviewOpen: boolean;
  previewData: SharePreviewData | null;
  handleShare: () => Promise<void>;
  handleClosePreview: () => void;
  handleConfirmShare: () => Promise<void>;
  isSubmitting: boolean;
}

export function useShare(options: UseShareOptions): UseShareReturn {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<SharePreviewData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShare = useCallback(async () => {
    setIsGeneratingImage(true);

    try {
      const success = await prepareSharePreview({
        ...options,
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
  }, [options]);

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
