"use client";

import CardWrapper from "@/common/components/cards/CardWrapper";
import { LoadingOverlay } from "@/common/components/LoadingOverlay";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { defaultThemeColors, ThemeColors } from "@/common/styles/themeColors";
import { formatDateForChart } from "@/lib/utils";
import { useGetPriceHistoryQuery } from "@/store/api/tokenomicsApi";
import { useEffect, useState } from "react";
import BarLineChart, { BarLineChartData } from "./BarLineChart";
import DaySelector from "./DaySelector";

interface PriceHistoryChartProps {
  onDaysChange: (days: number) => void;
  dayOptions?: number[];
  currentSelectedDay: number;
  themeColors?: ThemeColors;
}

export default function PriceHistoryChart({
  onDaysChange,
  dayOptions = [7, 30, 90],
  currentSelectedDay,
  themeColors = defaultThemeColors,
}: PriceHistoryChartProps) {
  const [chartData, setChartData] = useState<BarLineChartData[]>([]);

  const {
    data: priceHistoryData,
    isLoading,
    isFetching,
  } = useGetPriceHistoryQuery(currentSelectedDay);

  useEffect(() => {
    if (priceHistoryData) {
      setChartData(
        priceHistoryData.priceHistory.map((item) => ({
          x: formatDateForChart(item.date),
          y: item.price,
        }))
      );
    }
  }, [priceHistoryData]);

  const showLoadingOverlay = isFetching && priceHistoryData;

  return (
    <CardWrapper className="relative">
      {showLoadingOverlay && <LoadingOverlay />}
      <DaySelector
        dayOptions={dayOptions}
        selectedDay={currentSelectedDay}
        onDaysChange={onDaysChange}
        themeColors={themeColors}
      />
      <div className="h-[450px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <BarLineChart
            data={chartData ?? []}
            selectedDay={currentSelectedDay}
            yLabelFormatter={(value) => `$${value.toFixed(2)}`}
            showLine={true}
            showBars={false}
            areaLabel="Price"
            minYZero={true}
            themeColors={themeColors}
          />
        )}
      </div>
    </CardWrapper>
  );
}
