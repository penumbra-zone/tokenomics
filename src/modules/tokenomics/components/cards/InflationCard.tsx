import InfoCard from "@/common/components/cards/InfoCard";
import { COLORS } from "@/common/helpers/colors";
import { defaultThemeColors, ThemeColors } from "@/common/styles/themeColors";
import { useGetSummaryMetricsQuery } from "@/store/api/tokenomicsApi";
import Image from "next/image";
import { useEffect } from "react";

interface InflationCardProps {
  description?: string;
  cardClassName?: string;
  themeColors?: ThemeColors;
  onLoadingChange?: (isLoading: boolean) => void;
}

export function InflationCard({
  description = "During last month",
  cardClassName = "h-full",
  themeColors = defaultThemeColors,
  onLoadingChange,
}: InflationCardProps) {
  const { data: summaryMetrics, isLoading } = useGetSummaryMetricsQuery();

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const getPreviousMonthComparison = (
    lastMonthInflation: number,
    currentInflation: number
  ): { change: number; isIncrease: boolean } | null => {
    const change = lastMonthInflation - currentInflation;
    return {
      change,
      isIncrease: change > 0,
    };
  };

  const getInflationIndicator = () => {
    if (
      summaryMetrics?.inflation.current === null ||
      summaryMetrics?.inflation.current === undefined ||
      isLoading
    ) {
      return null;
    }

    const comparison = getPreviousMonthComparison(
      summaryMetrics?.inflation.lastMonth,
      summaryMetrics?.inflation.current
    );
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
        <span>{Math.abs(comparison.change).toFixed(3)}% vs. previous month</span>
      </div>
    );
  };

  return (
    <InfoCard
      title={
        <div className="flex items-center justify-between w-full">
          <span>Inflation</span>
          {getInflationIndicator()}
        </div>
      }
      isLoading={isLoading}
      value={summaryMetrics?.inflation.current ?? undefined}
      valueFormatter={(v: number) => `${v?.toFixed(2)}%`}
      description={<div className="text-xs text-neutral-500">{description}</div>}
      cardClassName={cardClassName}
      themeColors={themeColors}
    />
  );
}
