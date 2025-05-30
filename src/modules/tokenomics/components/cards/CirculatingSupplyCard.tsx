import InfoCard from "@/common/components/cards/InfoCard";
import { formatNumber } from "@/lib/utils";
import { useGetSupplyMetricsQuery } from "@/store/api/tokenomicsApi";
import { useEffect, useState } from "react";

export function CirculatingSupplyCard() {
  const { data: supply, isLoading } = useGetSupplyMetricsQuery();
  const [circulatingSupply, setCirculatingSupply] = useState(0);

  useEffect(() => {
    if (supply) {
      setCirculatingSupply(supply.totalUnstaked);
    }
  }, [supply]);

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
