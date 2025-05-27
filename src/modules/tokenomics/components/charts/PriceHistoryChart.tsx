"use client";

import { PriceHistory } from "@/store/api/tokenomicsApi";

import CardWrapper from "@/common/components/cards/CardWrapper";
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
    <CardWrapper>
      <DaySelector
        dayOptions={dayOptions}
        selectedDay={currentSelectedDay}
        onDaysChange={onDaysChange}
      />
      <div className="h-[400px]">
        <BarLineChart
          data={chartData}
          selectedDay={currentSelectedDay}
          yLabelFormatter={(value) => `$${value.toFixed(2)}`}
          showLine={true}
          showBars={false}
          areaLabel="Price"
          minYZero={true}
        />
      </div>
    </CardWrapper>
  );
}
