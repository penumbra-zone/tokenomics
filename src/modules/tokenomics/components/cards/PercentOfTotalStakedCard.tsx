import InfoCard from "@/common/components/cards/InfoCard";
import { useGetTokenDistributionQuery } from "@/store/api/tokenomicsApi";

export function PercentOfTotalStakedCard() {
  const { data: distribution, isLoading } = useGetTokenDistributionQuery();

  // Find the staked category from the distribution data
  const stakedData = distribution?.find((item) => item.category === "Staked");
  const percentage = stakedData?.percentage || 0;

  return (
    <InfoCard
      title="% Staked"
      isLoading={isLoading}
      value={percentage}
      valueFormatter={(v) => `${v.toFixed(0)}%`}
      description="Percentage of total supply staked"
      cardClassName="h-full"
    />
  );
}
