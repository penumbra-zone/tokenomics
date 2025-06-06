"use client";

import { ButtonHTMLAttributes } from "react";
import { useSharePreview } from "../context/SharePreviewContext";
import ShareButton from "./ShareButton";

interface SharePreviewButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export default function SharePreviewButton({ ...props }: SharePreviewButtonProps) {
  const { handleShareRequest, sharePreviewRef, isPreviewLoading } = useSharePreview();

  return (
    <ShareButton
      isContentLoading={isPreviewLoading}
      onClick={() => handleShareRequest(sharePreviewRef)}
      {...props}
    />
  );
}
