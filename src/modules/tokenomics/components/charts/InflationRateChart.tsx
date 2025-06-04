"use client";

import { defaultThemeColors, ThemeColors } from "@/common/styles/themeColors";
import { formatDateForChart, formatNumber } from "@/lib/utils";
import { useGetInflationTimeSeriesQuery } from "@/store/api/tokenomicsApi";
import { useState } from "react";

import CardWrapper from "@/common/components/cards/CardWrapper";
import { LoadingOverlay } from "@/common/components/LoadingOverlay";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import TogglePill from "@/common/components/TogglePill";
import BarLineChart from "./BarLineChart";
import DaySelector from "./DaySelector";

interface InflationRateChartProps {
  onDaysChange: (days: number) => void;
  dayOptions?: number[];
  currentSelectedDay: number;
  themeColors?: ThemeColors;
}

export default function InflationRateChart({
  onDaysChange,
  dayOptions = [7, 30, 90],
  currentSelectedDay,
  themeColors = defaultThemeColors,
}: InflationRateChartProps) {
  const [mode, setMode] = useState<"relative" | "absolute">("relative");

  const {
    data: inflationData,
    isLoading,
    isFetching,
  } = useGetInflationTimeSeriesQuery(currentSelectedDay);

  const chartData = inflationData?.timeSeries.map((item) => ({
    x: formatDateForChart(item.date),
    y: mode === "relative" ? item.inflationRate : item.absoluteAmount,
  }));

  const showLoadingOverlay = isFetching && inflationData;

  const valueFormatter = (value: number) => {
    if (mode === "relative") {
      return `${formatNumber(value, 2)}%`;
    } else {
      return `${formatNumber(value, 1)} UM`;
    }
  };

  return (
    <CardWrapper>
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="h-[450px] relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-2">
            <DaySelector
              dayOptions={dayOptions}
              selectedDay={currentSelectedDay}
              onDaysChange={onDaysChange}
              themeColors={themeColors}
            />
            <TogglePill
              options={[
                { label: "Relative (%)", value: "relative" },
                { label: "Absolute (UM)", value: "absolute" },
              ]}
              value={mode}
              onChange={(val) => setMode(val as "relative" | "absolute")}
              themeColors={themeColors}
            />
          </div>
          <BarLineChart
            data={chartData ?? []}
            selectedDay={currentSelectedDay}
            yLabelFormatter={valueFormatter}
            tooltipFormatter={valueFormatter}
            areaLabel={mode === "relative" ? "Inflation Rate (%)" : "Net Issuance (UM)"}
            minYZero={false}
            themeColors={themeColors}
          />
          {showLoadingOverlay && <LoadingOverlay />}
        </div>
      )}
    </CardWrapper>
  );
}
