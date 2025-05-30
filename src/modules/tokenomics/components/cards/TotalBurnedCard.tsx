import InfoCard from "@/common/components/cards/InfoCard";
import AnimatedNumber from "@/components/AnimatedNumber";
import { calculatePercentageOfSupplyBurned } from "@/lib/calculations";
import { formatNumber } from "@/lib/utils";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";
import { useMemo } from "react";

export function TotalBurnedCard() {
  const { data: summaryMetrics, isLoading } = useGetSummaryMetricsQuery();

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
