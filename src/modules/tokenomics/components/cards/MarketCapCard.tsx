import InfoCard from "@/common/components/cards/InfoCard";
import { formatNumber } from "@/lib/utils";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";
import { useEffect } from "react";

export interface MarketCapCardProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export function MarketCapCard({ onLoadingChange }: MarketCapCardProps) {
  const { data: socialMetrics, isLoading } = useGetSummaryMetricsQuery();

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

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
