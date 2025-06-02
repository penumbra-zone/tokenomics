"use client";

import { Button } from "@/components/ui/button";
import { SharePreviewData } from "@/lib/utils/types";
import { X } from "lucide-react";
import CustomXIcon from "./CustomXIcon";

interface SharePreviewModalProps {
  isOpen: boolean;
  previewData: SharePreviewData | null;
  onClose: () => void;
  onShareToX: () => Promise<void>;
  isSubmitting: boolean;
}

export default function SharePreviewModal({
  isOpen,
  previewData,
  onClose,
  onShareToX,
  isSubmitting,
}: SharePreviewModalProps) {
  if (!isOpen || !previewData) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <h2 className="text-lg font-semibold text-white">Share on X</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Twitter Card Preview Container */}
        <div className="p-6 bg-neutral-950 flex flex-col items-center">
          <div className="w-full max-w-md border border-neutral-700 rounded-xl overflow-hidden bg-neutral-800/30">
            {/* Image */}
            <img
              src={previewData.imageUrl}
              alt="Share preview image"
              className="w-full h-auto aspect-[1.91/1] object-cover"
            />
            {/* Text Content */}
            <div className="p-3 border-t border-neutral-700">
              <p className="text-xs text-neutral-500 mb-0.5">{window.location.origin}</p>
              <h3 className="text-sm font-semibold text-white truncate mb-1">
                {previewData.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-snug max-h-16 overflow-hidden text-ellipsis">
                {previewData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center p-4 border-t border-neutral-700 bg-neutral-800/50">
          <Button
            onClick={onShareToX}
            disabled={isSubmitting}
            className="w-full bg-[#000000] hover:bg-[#1A1A1A] text-white font-semibold flex items-center justify-center py-2.5"
          >
            <CustomXIcon className="h-5 w-5 mr-2 fill-white" />
            {isSubmitting ? "Sharing..." : "Share on X"}
          </Button>
        </div>
      </div>
    </div>
  );
}
