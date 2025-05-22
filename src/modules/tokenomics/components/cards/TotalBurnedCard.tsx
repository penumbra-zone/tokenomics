import InfoCard from "@/components/shared/InfoCard";
import AnimatedNumber from "@/components/AnimatedNumber";
import { formatNumber } from "@/lib/utils";
import { useGetBurnMetricsQuery } from "@/store/api/tokenomicsApi";

export function TotalBurnedCard() {
  const { data: burnMetrics, isLoading } = useGetBurnMetricsQuery();

  const descriptionContent = burnMetrics ? (
    <>
      Tokens removed from supply <br />
      Rate:{" "}
      <AnimatedNumber value={burnMetrics.burnRate} format={(v) => `${formatNumber(v, 4)}/block`} />
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
      // Ensure InfoCard uses the default bg-neutral-900/80 by not passing cardClassName
      // or if a different style from InfoCard default is needed, pass it here.
      // For now, relying on InfoCard -> CardWrapper default.
    />
  );
}
