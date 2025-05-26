import InfoCard from "@/common/components/cards/InfoCard";
import { formatNumber } from "@/lib/utils";
import { useGetSupplyMetricsQuery } from "@/store/api/tokenomicsApi";

export function CirculatingSupplyCard() {
  const { data: supply, isLoading } = useGetSupplyMetricsQuery();

  const circulatingSupply =
    supply?.totalSupply && supply?.unstakedSupply?.base
      ? supply.totalSupply - supply.unstakedSupply.base
      : 0;

  return (
    <InfoCard
      title="Circulating Supply"
      isLoading={isLoading}
      value={circulatingSupply}
      valueFormatter={(v) => formatNumber(v)}
      description="Token Currently Circulating"
    />
  );
}
