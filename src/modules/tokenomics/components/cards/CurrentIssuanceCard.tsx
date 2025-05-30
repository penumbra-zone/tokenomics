import InfoCard from "@/common/components/cards/InfoCard";
import { secondaryThemeColors } from "@/common/styles/themeColors";
import { formatNumber } from "@/lib/utils";
import { useGetIssuanceMetricsQuery } from "@/store/api/tokenomicsApi";

export function CurrentIssuanceCard() {
  const { data: issuanceMetrics, isLoading } = useGetIssuanceMetricsQuery();
  const currentIssuance = issuanceMetrics ? issuanceMetrics.currentIssuance : undefined;

  return (
    <InfoCard
      title="Current Issuance"
      isLoading={isLoading}
      value={currentIssuance}
      valueFormatter={(v) => formatNumber(v, 2)}
      description="$UM/block"
      themeColors={secondaryThemeColors}
    />
  );
}
