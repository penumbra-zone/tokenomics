import InfoCard from "@/common/components/cards/InfoCard";
import { secondaryThemeColors } from "@/common/styles/themeColors";
import { formatNumber } from "@/lib/utils";
import { useGetIssuanceMetricsQuery } from "@/store/api/tokenomicsApi";
import { useEffect } from "react";

export interface AnnualIssuanceCardProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export function AnnualIssuanceCard({ onLoadingChange }: AnnualIssuanceCardProps) {
  const { data: issuanceMetrics, isLoading } = useGetIssuanceMetricsQuery();

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const annualIssuance = issuanceMetrics ? issuanceMetrics.annualIssuance : undefined;

  return (
    <InfoCard
      title="Annual Issuance"
      isLoading={isLoading}
      value={annualIssuance}
      valueFormatter={(v) => "~" + formatNumber(v, 2)}
      description="$UM/year"
      themeColors={secondaryThemeColors}
    />
  );
}
