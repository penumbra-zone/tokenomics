import InfoCard from "@/common/components/cards/InfoCard";

// TODO: Replace with real data and loading state
const mockData = {
  percentage: 3.1,
  description: "Percentage of total supply burned",
};

export function PercentOfTotalSupplyCard() {
  return (
    <InfoCard
      title="% of Total Supply"
      isLoading={false}
      value={mockData.percentage}
      valueFormatter={(v) => `${v.toFixed(1)}%`}
      description={mockData.description}
      cardClassName="h-full"
    />
  );
}
