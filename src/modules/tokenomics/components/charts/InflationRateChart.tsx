"use client";

import { PriceHistory } from "@/store/api/tokenomicsApi";
import { useState } from "react";

import TogglePill from "@/common/components/TogglePill";
import BarLineChart from "./BarLineChart";
import DaySelector from "./DaySelector";

interface InflationRateChartProps {
  data: PriceHistory[];
  onDaysChange: (days: number) => void;
  dayOptions?: number[];
  currentSelectedDay: number;
}

export default function InflationRateChart({
  data,
  onDaysChange,
  dayOptions = [7, 30, 90],
  currentSelectedDay,
}: InflationRateChartProps) {
  const [mode, setMode] = useState<"relative" | "absolute">("relative");

  const chartData = data.map((item, index) => {
    if (index === 0) return { x: item.date, y: 0 };
    const prevPrice = data[index - 1].price;
    const currentPrice = item.price;
    const inflationRate = ((currentPrice - prevPrice) / prevPrice) * 100;
    return {
      x: item.date,
      y: inflationRate,
    };
  });

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <DaySelector
          dayOptions={dayOptions}
          selectedDay={currentSelectedDay}
          onDaysChange={onDaysChange}
        />
        <TogglePill
          options={[
            { label: "Relative", value: "relative" },
            { label: "Absolute", value: "absolute" },
          ]}
          value={mode}
          onChange={(val) => setMode(val as "relative" | "absolute")}
        />
      </div>
      <BarLineChart
        data={chartData}
        selectedDay={currentSelectedDay}
        yLabelFormatter={(value) => `${value.toFixed(2)}%`}
        tooltipFormatter={(params) => {
          const value = params[0].value as number;
          return `${params[0].name}<br/>${value.toFixed(2)}%`;
        }}
        areaLabel="Inflation Rate"
        minYZero={false}
      />
    </>
  );
}
