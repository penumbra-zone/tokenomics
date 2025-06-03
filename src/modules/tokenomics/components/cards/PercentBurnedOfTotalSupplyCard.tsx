import InfoCard from "@/common/components/cards/InfoCard";
import { calculatePercentageOfSupplyBurned } from "@/lib/calculations";
import { formatNumber } from "@/lib/utils";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";
import { useEffect, useMemo } from "react";

export interface PercentBurnedOfTotalSupplyCardProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export function PercentBurnedOfTotalSupplyCard({
  onLoadingChange,
}: PercentBurnedOfTotalSupplyCardProps) {
  const { data: summaryMetrics, isLoading } = useGetSummaryMetricsQuery();

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const percentage = useMemo(() => {
    return calculatePercentageOfSupplyBurned(
      summaryMetrics?.totalBurned || 0,
      summaryMetrics?.totalSupply || 0
    );
  }, [summaryMetrics]);

  return (
    <InfoCard
      title="% of Total Supply"
      isLoading={isLoading}
      value={percentage}
      valueFormatter={(v) => `${formatNumber(v, 2)}%`}
      description="Effective percentage of total supply burned"
    />
  );
}
