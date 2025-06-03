import InfoCard from "@/common/components/cards/InfoCard";
import AnimatedNumber from "@/components/AnimatedNumber";
import { calculatePercentageOfSupplyBurned } from "@/lib/calculations";
import { formatNumber } from "@/lib/utils";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";
import { useEffect, useMemo } from "react";

export interface TotalBurnedCardProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export function TotalBurnedCard({ onLoadingChange }: TotalBurnedCardProps) {
  const { data: summaryMetrics, isLoading } = useGetSummaryMetricsQuery();

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const totalBurned = summaryMetrics?.totalBurned ?? 0;
  const percentageOfTotalSupply = useMemo(() => {
    if (!summaryMetrics) return 0;
    return calculatePercentageOfSupplyBurned(
      summaryMetrics.totalBurned,
      summaryMetrics.totalSupply
    );
  }, [summaryMetrics]);

  return (
    <InfoCard
      title="Total Burned"
      isLoading={isLoading}
      value={totalBurned}
      valueFormatter={(v) => formatNumber(v)}
      description={
        <>
          <AnimatedNumber value={percentageOfTotalSupply} format={(num) => `${num.toFixed(2)}%`} />
          {" of total supply"}
        </>
      }
      cardClassName="h-full"
    />
  );
}
