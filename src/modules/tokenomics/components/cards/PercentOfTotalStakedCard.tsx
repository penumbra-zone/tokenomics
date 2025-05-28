import InfoCard from "@/common/components/cards/InfoCard";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";

export function PercentOfTotalStakedCard() {
  const { data: summaryMetrics, isLoading } = useGetSummaryMetricsQuery();

  if (!summaryMetrics) {
    return null;
  }

  const totalSupply = summaryMetrics.totalSupply;
  const stakedTokens = summaryMetrics.stakedTokens;
  const percentage = (stakedTokens / totalSupply) * 100;

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
