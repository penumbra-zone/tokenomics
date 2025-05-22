import InfoCard from "@/components/shared/InfoCard";
import { formatNumber } from "@/lib/utils";
import { useGetSupplyMetricsQuery } from "@/store/api/tokenomicsApi";

export function TotalSupplyCard() {
  const { data: supply, isLoading } = useGetSupplyMetricsQuery();

  return (
    <InfoCard
      title="Total Supply"
      isLoading={isLoading}
      value={supply?.totalSupply}
      valueFormatter={(v) => formatNumber(v, 1)}
      description="Maximum Token Supply"
    />
  );
}
