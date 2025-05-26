import { cn } from "@/common/helpers/utils";

import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingOverlayProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingOverlay({ className = "", size = "md" }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-10",
        className
      )}
    >
      <LoadingSpinner size={size} />
    </div>
  );
}
