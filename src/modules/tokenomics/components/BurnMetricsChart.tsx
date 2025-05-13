import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";
import { BurnMetrics } from "@/store/api/tokenomicsApi";

interface BurnMetricsChartProps {
  data: BurnMetrics;
}

export default function BurnMetricsChart({ data }: BurnMetricsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });
    const isDark = theme === "dark";
    const textColor = isDark ? "#fff" : "#222";
    const barGradient = {
      type: "linear",
      x: 0,
      y: 0,
      x2: 1,
      y2: 0,
      colorStops: [
        {
          offset: 0,
          color: isDark ? "#34d399" : "#059669", // Emerald
        },
        {
          offset: 1,
          color: isDark ? "#0f766e" : "#5eead4", // Teal
        },
      ],
    };
    const categories = [
      "Transaction Fees",
      "DEX Arbitrage",
      "Auction Burns",
      "DEX Burns",
    ];
    const values = [
      data.bySource.transactionFees,
      data.bySource.dexArbitrage,
      data.bySource.auctionBurns,
      data.bySource.dexBurns,
    ];
    chart.setOption({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: isDark ? "#222" : "#fff",
        borderColor: isDark ? "#34d399" : "#059669",
        textStyle: { color: textColor },
      },
      grid: {
        left: 120,
        right: 32,
        top: 32,
        bottom: 24,
        containLabel: true,
      },
      xAxis: {
        type: "value",
        splitLine: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: textColor,
          fontWeight: 500,
          fontSize: 13,
          formatter: (value: number) => value.toLocaleString(),
        },
      },
      yAxis: {
        type: "category",
        data: categories,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: textColor,
          fontWeight: 600,
          fontSize: 15,
        },
      },
      series: [
        {
          name: "Burned",
          type: "bar",
          data: values,
          barWidth: 16,
          itemStyle: {
            color: barGradient,
            borderRadius: 0,
            shadowBlur: 8,
            shadowColor: isDark ? "#34d39933" : "#05966922",
          },
          emphasis: {
            itemStyle: {
              opacity: 0.9,
            },
          },
        },
      ],
    });
    function handleResize() {
      chart.resize();
    }
    window.addEventListener("resize", handleResize);
    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [data, theme]);

  return (
    <div
      ref={chartRef}
      className="w-full h-full bg-background/60 border border-border shadow"
      style={{ minHeight: 320 }}
    />
  );
}
