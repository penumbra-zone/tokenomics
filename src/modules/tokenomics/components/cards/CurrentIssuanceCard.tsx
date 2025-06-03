import InfoCard from "@/common/components/cards/InfoCard";
import { secondaryThemeColors } from "@/common/styles/themeColors";
import { formatNumber } from "@/lib/utils";
import { useGetIssuanceMetricsQuery } from "@/store/api/tokenomicsApi";
import { useEffect } from "react";

export interface CurrentIssuanceCardProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export function CurrentIssuanceCard({ onLoadingChange }: CurrentIssuanceCardProps) {
  const { data: issuanceMetrics, isLoading } = useGetIssuanceMetricsQuery();

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const currentIssuance = issuanceMetrics ? issuanceMetrics.currentIssuance : undefined;

  return (
    <InfoCard
      title="Current Issuance"
      isLoading={isLoading}
      value={currentIssuance}
      valueFormatter={(v) => formatNumber(v, 2)}
      description="$UM/block"
      themeColors={secondaryThemeColors}
    />
  );
}
