"use client";

import { formatNumber } from "@/lib/utils";
import { format } from "date-fns";
import BarLineChart from "./BarLineChart";
import DaySelector from "./DaySelector";

interface BurnRateDataPoint {
  date: string;
  value: number;
}

interface BurnRateOverTimeChartProps {
  data: BurnRateDataPoint[];
  selectedDay: number;
  onDaysChange: (days: number) => void;
}

export function BurnRateOverTimeChart({
  data,
  selectedDay,
  onDaysChange,
}: BurnRateOverTimeChartProps) {
  const chartData = data.map((item) => ({
    x: item.date,
    y: item.value,
  }));

  return (
    <>
      <DaySelector dayOptions={[7, 30, 90]} selectedDay={selectedDay} onDaysChange={onDaysChange} />
      <BarLineChart
        data={chartData}
        selectedDay={selectedDay}
        yLabelFormatter={(value) => `${formatNumber(value, 3)}`}
        tooltipFormatter={(params) => {
          const value = params[0].value as number;
          const date = format(new Date(params[0].name), "MMM dd, yyyy");
          return `${date}<br/>Tokens burned: <b>${formatNumber(value, 3)}</b>`;
        }}
        areaLabel="Tokens Burned"
        showBars={false}
        showLine={true}
        showArea={true}
        minYZero={true}
      />
    </>
  );
}
