import InfoCard from "@/common/components/cards/InfoCard";
import { calculatePercentageOfSupplyBurned } from "@/lib/calculations";
import { formatNumber } from "@/lib/utils";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";
import { useEffect, useState } from "react";

export function PercentBurnedOfTotalSupplyCard() {
  const { data: summaryMetrics, isLoading } = useGetSummaryMetricsQuery();
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (summaryMetrics) {
      setPercentage(
        calculatePercentageOfSupplyBurned(summaryMetrics.totalBurned, summaryMetrics.totalSupply)
      );
    }
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
