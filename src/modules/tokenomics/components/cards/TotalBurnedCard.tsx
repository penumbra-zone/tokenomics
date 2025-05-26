import InfoCard from "@/common/components/InfoCard";
import { formatNumber } from "@/lib/utils";
import { useGetBurnMetricsQuery } from "@/store/api/tokenomicsApi";

export function TotalBurnedCard() {
  const { data: burnMetrics, isLoading } = useGetBurnMetricsQuery();

  const descriptionContent = burnMetrics ? (
    <>
      Tokens removed from supply <br />
    </>
  ) : (
    "Tokens removed from supply"
  );

  return (
    <InfoCard
      title="Total Burned"
      isLoading={isLoading}
      value={burnMetrics?.totalBurned}
      valueFormatter={(v) => formatNumber(v)}
      description={descriptionContent}
      cardClassName="h-full"
    />
  );
}
