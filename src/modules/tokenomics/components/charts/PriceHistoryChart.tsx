"use client";

import { PriceHistory } from "@/store/api/tokenomicsApi";

import CardWrapper from "@/common/components/CardWrapper";
import BarLineChart from "./BarLineChart";
import DaySelector from "./DaySelector";

interface PriceHistoryChartProps {
  data: PriceHistory[];
  onDaysChange: (days: number) => void;
  dayOptions?: number[];
  currentSelectedDay: number;
}

export default function PriceHistoryChart({
  data,
  onDaysChange,
  dayOptions = [7, 30, 90],
  currentSelectedDay,
}: PriceHistoryChartProps) {
  const chartData = data.map((item) => ({
    x: item.date,
    y: item.price,
  }));

  return (
    <CardWrapper className="h-full">
      <DaySelector
        dayOptions={dayOptions}
        selectedDay={currentSelectedDay}
        onDaysChange={onDaysChange}
      />
      <BarLineChart
        data={chartData}
        selectedDay={currentSelectedDay}
        yLabelFormatter={(value) => `$${value.toFixed(2)}`}
        tooltipFormatter={(params) => {
          const value = params[0].value as number;
          return `${params[0].name}<br/>$${value.toFixed(2)}`;
        }}
        showLine={true}
        areaLabel="Price"
        minYZero={true}
      />
    </CardWrapper>
  );
}
