import InfoCard from "@/common/components/cards/InfoCard";
import { formatNumber } from "@/lib/utils";
import { useGetIssuanceMetricsQuery } from "@/store/api/tokenomicsApi";

export function AnnualIssuanceCard() {
  const { data: issuanceMetrics, isLoading } = useGetIssuanceMetricsQuery();
  const annualIssuance = issuanceMetrics ? issuanceMetrics.annualIssuance : undefined;

  return (
    <InfoCard
      title="Annual Issuance"
      isLoading={isLoading}
      value={annualIssuance}
      valueFormatter={(v) => "~" + formatNumber(v, 2)}
      description="TOKEN/year"
    />
  );
}
