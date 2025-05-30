import InfoCard from "@/common/components/cards/InfoCard";
import { defaultThemeColors, ThemeColors } from "@/common/styles/themeColors";
import { calculatePercentageStaked } from "@/lib/calculations";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";
import { useMemo } from "react";

interface PercentStakedOfTotalSupplyCardProps {
  themeColors?: ThemeColors;
}

export function PercentStakedOfTotalSupplyCard({
  themeColors = defaultThemeColors,
}: PercentStakedOfTotalSupplyCardProps) {
  const { data: summaryMetrics, isLoading } = useGetSummaryMetricsQuery();

  const percentage = useMemo(() => {
    return calculatePercentageStaked(
      summaryMetrics?.stakedTokens || 0,
      summaryMetrics?.totalSupply || 0
    );
  }, [summaryMetrics]);

  return (
    <InfoCard
      title="% Staked"
      isLoading={isLoading}
      value={percentage}
      valueFormatter={(v) => `${v.toFixed(0)}%`}
      description="Percentage of total supply staked"
      cardClassName="h-full"
      themeColors={themeColors}
    />
  );
}
