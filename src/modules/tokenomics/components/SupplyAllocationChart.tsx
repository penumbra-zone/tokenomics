"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";

interface SupplyAllocationChartProps {
  genesisAllocation: number;
  issuedSinceLaunch: number;
}

export default function SupplyAllocationChart({
  genesisAllocation,
  issuedSinceLaunch,
}: SupplyAllocationChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });

    const isDark = theme === "dark";
    const backgroundColor = "transparent";
    const textColor = isDark ? "#fff" : "#222";
    const legendTextColor = isDark ? "#a7ffeb" : "#00796b";
    const colors = [
      isDark ? "#34d399" : "#059669", // Emerald
      isDark ? "#fbbf24" : "#f59e42", // Amber
    ];

    const total = genesisAllocation + issuedSinceLaunch;
    const data = [
      {
        value: genesisAllocation,
        name: "Genesis Allocation",
        itemStyle: { color: colors[0] },
      },
      {
        value: issuedSinceLaunch,
        name: "Issued Since Launch",
        itemStyle: { color: colors[1] },
      },
    ];

    chart.setOption({
      backgroundColor,
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
        backgroundColor: isDark ? "#222" : "#fff",
        borderColor: isDark ? "#34d399" : "#059669",
        textStyle: { color: textColor },
      },
      legend: {
        orient: "vertical",
        left: 20,
        top: "center",
        textStyle: {
          color: legendTextColor,
          fontWeight: 600,
          fontSize: 14,
        },
        itemWidth: 18,
        itemHeight: 12,
      },
      series: [
        {
          name: "Supply Allocation",
          type: "pie",
          radius: ["75%", "85%"],
          center: ["60%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: backgroundColor,
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: isDark
              ? "rgba(52,211,153,0.15)"
              : "rgba(5,150,105,0.10)",
          },
          label: {
            show: true,
            position: "center",
            formatter: () =>
              total > 0
                ? `${((genesisAllocation / total) * 100).toFixed(
                    1
                  )}%\nGenesis\n${((issuedSinceLaunch / total) * 100).toFixed(
                    1
                  )}%\nIssued`
                : "-",
            color: textColor,
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 22,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data,
        },
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    });

    function handleResize() {
      chart.resize();
    }
    window.addEventListener("resize", handleResize);
    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [genesisAllocation, issuedSinceLaunch, theme]);

  return (
    <div
      ref={chartRef}
      className="w-full h-full rounded-xl bg-background/60 border border-border shadow"
      style={{ minHeight: 320 }}
    />
  );
}
