import InfoCard from "@/common/components/cards/InfoCard";
import { formatNumber } from "@/lib/utils";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";

export function TotalBurnedCard() {
  const { data: summaryMetrics, isLoading } = useGetSummaryMetricsQuery();

  if (!summaryMetrics) {
    return null;
  }

  const totalBurned = summaryMetrics.totalBurned;
  const percentageOfTotalSupply = (totalBurned / summaryMetrics.totalSupply) * 100;

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
