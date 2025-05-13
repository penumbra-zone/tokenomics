"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";
import { TokenDistribution } from "@/store/api/tokenomicsApi";

interface TokenDistributionChartProps {
  data: TokenDistribution[];
}

export default function TokenDistributionChart({
  data,
}: TokenDistributionChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });
    const isDark = theme === "dark";
    const textColor = isDark ? "#fff" : "#222";
    const colors = [
      "#10b981", // Community - emerald
      "#f59e42", // Team & Advisors - amber
      "#059669", // Foundation - green
      "#ea580c", // Ecosystem - orange
    ];
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    chart.setOption({
      backgroundColor: "transparent",
      color: colors,
      tooltip: {
        trigger: "item",
        formatter: (params: any) =>
          `${params.name}: ${params.value.toLocaleString()} (${
            params.percent
          }%)`,
        backgroundColor: isDark ? "#222" : "#fff",
        borderColor: isDark ? "#10b981" : "#059669",
        textStyle: { color: textColor },
      },
      legend: {
        show: false, // We'll render a custom legend below
      },
      series: [
        {
          name: "Token Distribution",
          type: "pie",
          radius: ["75%", "85%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: "transparent",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "center",
            formatter: () =>
              total > 0
                ? `${(total / 1_000_000).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}M\nTotal Supply`
                : "-",
            color: textColor,
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 28,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 22,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: data.map((item, i) => ({
            name: item.category,
            value: item.amount,
            itemStyle: { color: colors[i % colors.length] },
          })),
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
  }, [data, theme]);

  // Custom legend below the chart
  const legendColors = [
    "bg-emerald-500",
    "bg-amber-500",
    "bg-emerald-700",
    "bg-amber-700",
  ];

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center rounded-xl bg-background/60 border border-border shadow"
      style={{ minHeight: 320 }}
    >
      <div ref={chartRef} className="w-full h-[260px]" />
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        {data.map((item, i) => (
          <div key={item.category} className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                legendColors[i % legendColors.length]
              }`}
            />
            <span className="text-sm font-medium text-foreground">
              {item.category}
            </span>
            <span className="text-xs text-muted-foreground">
              {((item.amount / (total || 1)) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
