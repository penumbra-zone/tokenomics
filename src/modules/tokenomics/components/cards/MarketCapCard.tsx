import InfoCard from "@/common/components/cards/InfoCard";
import { formatNumber } from "@/lib/utils";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";

export function MarketCapCard() {
  const { data: socialMetrics, isLoading } = useGetSummaryMetricsQuery();

  return (
    <InfoCard
      title="Market Cap"
      isLoading={isLoading}
      value={socialMetrics?.marketCap}
      valueFormatter={(v) => formatNumber(v, 1)}
      description="Total Supply × Price In USDC"
    />
  );
}
