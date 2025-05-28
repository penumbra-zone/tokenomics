import InfoCard from "@/common/components/cards/InfoCard";
import { formatNumber } from "@/lib/utils";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";

export function TotalSupplyCard() {
  const { data: summaryMetrics, isLoading } = useGetSummaryMetricsQuery();

  if (!summaryMetrics) {
    return null;
  }

  return (
    <InfoCard
      title="Total Supply"
      isLoading={isLoading}
      value={summaryMetrics.totalSupply}
      valueFormatter={(v) => formatNumber(v, 1)}
      description="Maximum Token Supply"
    />
  );
}
