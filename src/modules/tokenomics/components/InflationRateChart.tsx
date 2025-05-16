import { PriceHistory } from "@/store/api/tokenomicsApi";

import BarLineChart from "./BarLineChart";

interface InflationRateChartProps {
  data: PriceHistory[];
  onDaysChange?: (days: number) => void;
}

export default function InflationRateChart({ data, onDaysChange }: InflationRateChartProps) {
  // Calculate inflation rate based on price changes
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
    <BarLineChart
      data={chartData}
      yLabelFormatter={(value) => `${value.toFixed(2)}%`}
      tooltipFormatter={(params) => {
        const value = params[0].value as number;
        return `${params[0].name}<br/>${value.toFixed(2)}%`;
      }}
      areaLabel="Inflation Rate"
      minYZero={false}
      dayOptions={[7, 30, 90]}
      defaultDays={30}
      onDaysChange={onDaysChange}
    />
  );
}
