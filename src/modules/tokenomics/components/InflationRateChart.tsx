import { PriceHistory } from "@/store/api/tokenomicsApi";
import BarLineChart from "./BarLineChart";

interface InflationRateChartProps {
  data: PriceHistory[];
}

export default function InflationRateChart({ data }: InflationRateChartProps) {
  // Calculate inflation rate based on price changes
  const chartData = data.map((item, index) => {
    if (index === 0) return { x: item.date, y: 0 };
    const prevPrice = data[index - 1].price;
    const currentPrice = item.price;
    const rate = ((currentPrice - prevPrice) / prevPrice) * 100;
    return { x: item.date, y: rate };
  });

  return (
    <BarLineChart
      data={chartData}
      yLabelFormatter={(value) => `${value.toFixed(2)}%`}
      tooltipFormatter={(params) => {
        const bar = params.find((p: any) => p.seriesType === "bar");
        const line = params.find((p: any) => p.seriesType === "line");
        return `${
          bar.axisValueLabel || new Date(bar.name).toLocaleDateString()
        }<br/>Inflation: <b>${line.data.toFixed(2)}%</b>`;
      }}
      areaLabel="Inflation"
      yPadding={0.2}
      minYZero={false}
    />
  );
}
