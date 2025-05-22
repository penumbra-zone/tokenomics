import InfoCard from "@/components/shared/InfoCard";
import { formatNumber } from "@/lib/utils";
import { useGetSocialMetricsQuery } from "@/store/api/tokenomicsApi";

export function MarketCapCard() {
  const { data: socialMetrics, isLoading } = useGetSocialMetricsQuery();

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
