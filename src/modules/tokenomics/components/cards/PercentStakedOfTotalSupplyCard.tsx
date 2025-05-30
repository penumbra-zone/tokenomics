import InfoCard from "@/common/components/cards/InfoCard";
import { calculatePercentageStaked } from "@/lib/calculations";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";
import { useEffect, useState } from "react";

export function PercentStakedOfTotalSupplyCard() {
  const { data: summaryMetrics, isLoading } = useGetSummaryMetricsQuery();
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (summaryMetrics) {
      const totalSupply = summaryMetrics.totalSupply;
      const stakedTokens = summaryMetrics.stakedTokens;
      const percentage = calculatePercentageStaked(stakedTokens, totalSupply);
      setPercentage(percentage);
    }
  }, [summaryMetrics]);

  return (
    <InfoCard
      title="% Staked"
      isLoading={isLoading}
      value={percentage}
      valueFormatter={(v) => `${v.toFixed(0)}%`}
      description="Percentage of total supply staked"
      cardClassName="h-full"
    />
  );
}
