import InfoCard from "@/common/components/cards/InfoCard";
import { secondaryThemeColors } from "@/common/styles/themeColors";
import { formatNumber } from "@/lib/utils";
import { useGetSupplyMetricsQuery } from "@/store/api/tokenomicsApi";
import { useEffect, useMemo } from "react";

export interface CirculatingSupplyCardProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export function CirculatingSupplyCard({ onLoadingChange }: CirculatingSupplyCardProps) {
  const { data: supply, isLoading } = useGetSupplyMetricsQuery();

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const circulatingSupply = useMemo(() => {
    return supply?.totalUnstaked;
  }, [supply]);

  return (
    <InfoCard
      title="Circulating Supply"
      isLoading={isLoading}
      value={circulatingSupply}
      valueFormatter={(v) => formatNumber(v)}
      description="Token Currently Circulating"
      themeColors={secondaryThemeColors}
    />
  );
}
