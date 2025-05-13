import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { BurnMetrics } from "@/store/api/tokenomicsApi";

interface BurnMetricsChartProps {
  data: BurnMetrics;
}

export default function BurnMetricsChart({ data }: BurnMetricsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: "{b}: {c}",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: [
          "Transaction Fees",
          "DEX Arbitrage",
          "Auction Burns",
          "DEX Burns",
        ],
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value: number) => value.toLocaleString(),
        },
      },
      series: [
        {
          type: "bar",
          data: [
            data.bySource.transactionFees,
            data.bySource.dexArbitrage,
            data.bySource.auctionBurns,
            data.bySource.dexBurns,
          ],
          itemStyle: {
            color: "#8884d8",
          },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
}
