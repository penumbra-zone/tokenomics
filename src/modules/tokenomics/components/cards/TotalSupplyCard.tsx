import InfoCard from "@/common/components/cards/InfoCard";
import { formatNumber } from "@/lib/utils";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";
import { useEffect } from "react";

export interface TotalSupplyCardProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export function TotalSupplyCard({ onLoadingChange }: TotalSupplyCardProps) {
  const { data: summaryMetrics, isLoading } = useGetSummaryMetricsQuery();

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  return (
    <InfoCard
      title="Total Supply"
      isLoading={isLoading}
      value={summaryMetrics?.totalSupply}
      valueFormatter={(v) => formatNumber(v, 1)}
      description="Maximum Token Supply"
    />
  );
}
