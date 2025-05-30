"use client";

import { Button } from "@/components/ui/button";
import { useOGPreview } from "@/lib/hooks/useOGPreview";
import { SharePreviewModal } from "@/modules/tokenomics/components/share";
import { Share2 } from "lucide-react";
import { useRef } from "react";

interface ShareButtonProps {
  elementRef?: React.RefObject<HTMLElement>;
  sectionName: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function ShareButton({
  elementRef,
  sectionName,
  variant = "outline",
  size = "sm",
  className = "",
}: ShareButtonProps) {
  const fallbackRef = useRef<HTMLElement>(null);
  const targetRef = elementRef || fallbackRef;

  const {
    isGenerating,
    isPreviewOpen,
    previewData,
    generatePreview,
    closePreview,
    downloadImage,
    copyImage,
  } = useOGPreview({
    elementRef: targetRef,
    sectionName,
  });

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={generatePreview}
        disabled={isGenerating}
        className={`gap-2 ${className}`}
      >
        <Share2 className="h-4 w-4" />
        {isGenerating ? "Generating..." : "Share"}
      </Button>

      <SharePreviewModal
        isOpen={isPreviewOpen}
        previewData={previewData}
        onClose={closePreview}
        onDownload={downloadImage}
        onCopyImage={copyImage}
      />
    </>
  );
}
