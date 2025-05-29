"use client";

import CardWrapper from "@/common/components/cards/CardWrapper";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { formatDateForChart } from "@/lib/utils";
import { useGetPriceHistoryQuery } from "@/store/api/tokenomicsApi";
import BarLineChart from "./BarLineChart";
import DaySelector from "./DaySelector";

interface PriceHistoryChartProps {
  onDaysChange: (days: number) => void;
  dayOptions?: number[];
  currentSelectedDay: number;
}

export default function PriceHistoryChart({
  onDaysChange,
  dayOptions = [7, 30, 90],
  currentSelectedDay,
}: PriceHistoryChartProps) {
  const {
    data: priceHistoryData,
    isLoading,
    isFetching,
  } = useGetPriceHistoryQuery(currentSelectedDay);

  if (isLoading || isFetching || !priceHistoryData) {
    return (
      <CardWrapper>
        <div className="flex items-center justify-center h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </CardWrapper>
    );
  }

  const chartData = priceHistoryData.priceHistory.map((item) => ({
    x: formatDateForChart(item.date),
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
