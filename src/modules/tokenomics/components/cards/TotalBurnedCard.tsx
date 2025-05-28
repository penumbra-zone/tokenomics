import InfoCard from "@/common/components/cards/InfoCard";
import { formatNumber } from "@/lib/utils";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";
import { useEffect, useState } from "react";

export function TotalBurnedCard() {
  const { data: summaryMetrics, isLoading } = useGetSummaryMetricsQuery();

  const [totalBurned, setTotalBurned] = useState(0);
  const [percentageOfTotalSupply, setPercentageOfTotalSupply] = useState(0);

  useEffect(() => {
    if (summaryMetrics) {
      setTotalBurned(summaryMetrics.totalBurned);
      setPercentageOfTotalSupply((summaryMetrics.totalBurned / summaryMetrics.totalSupply) * 100);
    }
  }, [summaryMetrics]);

  return (
    <InfoCard
      title="Total Burned"
      isLoading={isLoading}
      value={totalBurned}
      valueFormatter={(v) => formatNumber(v)}
      description={`${percentageOfTotalSupply.toFixed(2)}% of total supply`}
      cardClassName="h-full"
    />
  );
}
