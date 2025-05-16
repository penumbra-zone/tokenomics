"use client";

import { PriceHistory } from "@/store/api/tokenomicsApi";

import BarLineChart from "./BarLineChart";

interface PriceHistoryChartProps {
  data: PriceHistory[];
  onDaysChange?: (days: number) => void;
}

export default function PriceHistoryChart({ data, onDaysChange }: PriceHistoryChartProps) {
  const chartData = data.map((item) => ({
    x: item.date,
    y: item.price,
  }));

  return (
    <BarLineChart
      data={chartData}
      yLabelFormatter={(value) => `$${value.toFixed(2)}`}
      tooltipFormatter={(params) => {
        const value = params[0].value as number;
        return `${params[0].name}<br/>$${value.toFixed(2)}`;
      }}
      areaLabel="Price"
      minYZero={true}
      dayOptions={[7, 30, 90]}
      defaultDays={30}
      onDaysChange={onDaysChange}
    />
  );
}
