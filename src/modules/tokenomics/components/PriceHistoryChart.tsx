"use client";

import { PriceHistory } from "@/store/api/tokenomicsApi";

import BarLineChart from "./BarLineChart";

interface PriceHistoryChartProps {
  data: PriceHistory[];
}

export default function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  // Map data to BarLineChartData
  const chartData = data.map((item) => ({ x: item.date, y: item.price }));

  // X-axis labels for 30d/20d/10d/Now
  const xLabels =
    data.length >= 4
      ? [
          data[0].date,
          data[Math.floor(data.length / 3)].date,
          data[Math.floor((2 * data.length) / 3)].date,
          data[data.length - 1].date,
        ]
      : data.map((item) => item.date);

  return (
    <BarLineChart
      data={chartData}
      xLabels={xLabels}
      yLabelFormatter={(value) => `$${value.toFixed(2)}`}
      tooltipFormatter={(params) => {
        const bar = params.find((p: any) => p.seriesType === "bar");
        const line = params.find((p: any) => p.seriesType === "line");
        return `${bar.axisValueLabel || bar.name}<br/>Price: <b>$${line.data.toFixed(2)}</b>`;
      }}
      areaLabel="Price"
      yPadding={0.2}
      minYZero={true}
    />
  );
}
