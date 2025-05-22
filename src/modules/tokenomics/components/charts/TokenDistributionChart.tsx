"use client";

import * as echarts from "echarts";

import { useEffect, useRef } from "react";

import { useTheme } from "next-themes";

import { hexToRgb } from "@/common/helpers/colorUtils";
import { CHART_PALETTES, COLORS } from "@/common/helpers/colors";
import { TokenDistribution } from "@/store/api/tokenomicsApi";

interface TokenDistributionChartProps {
  data: TokenDistribution[];
}

export default function TokenDistributionChart({ data }: TokenDistributionChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const themeColors = CHART_PALETTES.tokenomics;

  useEffect(() => {
    if (!chartRef.current || themeColors.length === 0) return;

    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });
    const isDark = resolvedTheme === "dark";
    const textColor = isDark ? "#fff" : "#222";

    const total = data.reduce((sum, item) => sum + item.amount, 0);
    chart.setOption({
      backgroundColor: "transparent",
      color: themeColors,
      tooltip: {
        trigger: "item",
        formatter: (params: any) =>
          `${params.name}: ${params.value.toLocaleString()} (${params.percent}%)`,
        backgroundColor: isDark ? "#222" : "#fff",
        borderColor: themeColors[0], // primary color
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
            itemStyle: {
              shadowBlur: 15, // Increase shadow on hover
              shadowColor: `rgba(${hexToRgb(COLORS.primary.DEFAULT)},0.35)`,
            },
          },
          labelLine: {
            show: false,
          },
          data: data.map((item, i) => ({
            name: item.category,
            value: item.amount,
            itemStyle: { color: themeColors[i % themeColors.length] },
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
  }, [data, resolvedTheme, themeColors]);

  // Use the dynamically generated colors for the legend
  const getLegendStyle = (index: number) => {
    return {
      backgroundColor: themeColors[index % themeColors.length] || "currentColor",
    };
  };

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
            <span className="w-3 h-3 rounded-full" style={getLegendStyle(i)} />
            <span className="text-sm font-medium text-foreground">{item.category}</span>
            <span className="text-xs text-muted-foreground">
              {((item.amount / (total || 1)) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
