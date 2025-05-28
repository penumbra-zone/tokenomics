import InfoCard from "@/common/components/cards/InfoCard";
import { COLORS } from "@/common/helpers/colors";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";
import Image from "next/image";

interface InflationCardProps {
  description?: string;
  cardClassName?: string;
}

export function InflationCard({
  description = "during last month",
  cardClassName = "h-full",
}: InflationCardProps) {
  const { data: summaryMetrics, isLoading } = useGetSummaryMetricsQuery();
  const value = summaryMetrics?.inflationRate;

  // TODO: Add calculation for previous month comparison
  const getPreviousMonthComparison = (): { change: number; isIncrease: boolean } | null => {
    // This will be implemented with your calculation logic
    // Should return something like: { change: 0.3, isIncrease: false }
    return { change: 0.3, isIncrease: false };
  };

  const getInflationIndicator = () => {
    if (value === null || value === undefined || isLoading) {
      return null;
    }

    const comparison = getPreviousMonthComparison();
    if (!comparison) {
      return null;
    }

    const isIncrease = comparison.isIncrease;
    const arrowSrc = isIncrease ? "/arrow_up.svg" : "/arrow_down.svg";

    return (
      <div
        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2"
        style={{ backgroundColor: "#FAFAFA1A", color: COLORS.neutral[50] }}
      >
        <Image
          src={arrowSrc}
          alt={isIncrease ? "Inflation increased" : "Inflation decreased"}
          width={12}
          height={12}
          style={{
            filter: isIncrease
              ? "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)" // Red filter
              : "brightness(0) saturate(100%) invert(69%) sepia(78%) saturate(1200%) hue-rotate(88deg) brightness(96%) contrast(86%)", // Green filter
          }}
        />
        <span>{Math.abs(comparison.change).toFixed(1)}% vs. previous month</span>
      </div>
    );
  };

  return (
    <InfoCard
      title={
        <div>
          <div className="mb-2">Inflation</div>
          {getInflationIndicator()}
        </div>
      }
      isLoading={isLoading}
      value={value ?? undefined}
      valueFormatter={(v: number) => `${v?.toFixed(2)}%`}
      description={<div className="text-xs text-neutral-500">{description}</div>}
      cardClassName={cardClassName}
    />
  );
}
