"use client";

import { formatDateForChart } from "@/lib/utils";
import { useGetPriceHistoryQuery } from "@/store/api/tokenomicsApi";
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
}

export default function InflationRateChart({
  onDaysChange,
  dayOptions = [7, 30, 90],
  currentSelectedDay,
}: InflationRateChartProps) {
  const [mode, setMode] = useState<"relative" | "absolute">("relative");

  const {
    data: priceHistoryData,
    isLoading,
    isFetching,
  } = useGetPriceHistoryQuery(currentSelectedDay);

  const chartData = priceHistoryData?.priceHistory.map((item, index) => {
    if (index === 0) return { x: formatDateForChart(item.date), y: 0 };
    const prevPrice = priceHistoryData.priceHistory[index - 1].price;
    const currentPrice = item.price;
    const inflationRate = ((currentPrice - prevPrice) / prevPrice) * 100;
    return {
      x: formatDateForChart(item.date),
      y: inflationRate,
    };
  });

  const showLoadingOverlay = isFetching && priceHistoryData;

  return (
    <CardWrapper>
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="h-[450px]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-2">
            <DaySelector
              dayOptions={dayOptions}
              selectedDay={currentSelectedDay}
              onDaysChange={onDaysChange}
            />
            <div className="self-start sm:self-auto">
              <TogglePill
                options={[
                  { label: "Relative", value: "relative" },
                  { label: "Absolute", value: "absolute" },
                ]}
                value={mode}
                onChange={(val) => setMode(val as "relative" | "absolute")}
              />
            </div>
          </div>
          <BarLineChart
            data={chartData ?? []}
            selectedDay={currentSelectedDay}
            yLabelFormatter={(value) =>
              mode === "relative" ? `${value.toFixed(2)}%` : `$${value.toFixed(4)}`
            }
            areaLabel={mode === "relative" ? "Inflation Rate" : "Token Price"}
            minYZero={mode === "absolute"}
          />
          {showLoadingOverlay && <LoadingOverlay />}
        </div>
      )}
    </CardWrapper>
  );
}
