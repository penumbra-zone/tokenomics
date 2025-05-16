import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingOverlayProps {
  className?: string;
}

export function LoadingOverlay({ className = "" }: LoadingOverlayProps) {
  return (
    <div
      className={`absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-10 ${className}`}
    >
      <LoadingSpinner size="md" />
    </div>
  );
}
