"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const { resolvedTheme } = useTheme();
  const [primaryColor, setPrimaryColor] = useState("#f49c43");
  const [secondaryColor, setSecondaryColor] = useState("#2a7a8c");

  // Get CSS variable for primary color
  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryHsl = rootStyles.getPropertyValue("--primary").trim();
    const secondaryHsl = rootStyles.getPropertyValue("--secondary").trim();

    // Convert HSL values to hex
    const [h, s, l] = primaryHsl.split(" ").map((val) => parseFloat(val));
    setPrimaryColor(hslToHex(h, s, l));

    const [hSec, sSec, lSec] = secondaryHsl
      .split(" ")
      .map((val) => parseFloat(val));
    setSecondaryColor(hslToHex(hSec, sSec, lSec));
  }, [resolvedTheme]);

  // HSL to Hex conversion helper
  function hslToHex(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  // Get a color palette with highly contrasting colors for better visibility
  function getDistinctColors(isDark: boolean) {
    // Define a set of high-contrast colors that work well together
    return isDark
      ? [
          "#f49c43", // Primary orange
          "#3EBBCA", // Bright teal - much brighter for dark mode
          "#DB5461", // Raspberry
          "#9FD356", // Lime
          "#7C77B9", // Purple
          "#FFBC42", // Yellow
        ]
      : [
          "#f49c43", // Primary orange
          "#2a7a8c", // Secondary teal
          "#C23F5E", // Crimson
          "#66A33D", // Green
          "#6B60E0", // Indigo
          "#ED9A2A", // Golden
        ];
  }

  // Hex to RGB helper
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )}`
      : "244, 156, 67"; // Fallback to primary
  }

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });
    const isDark = resolvedTheme === "dark";
    const textColor = isDark ? "#fff" : "#222";
    const colors = getDistinctColors(isDark);

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
        borderColor: primaryColor,
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
  }, [data, resolvedTheme, primaryColor, secondaryColor]);

  // Custom colors for the legend - using inline style for exact color matching
  const getLegendStyle = (index: number) => {
    const isDark = resolvedTheme === "dark";
    const colors = getDistinctColors(isDark);
    return { backgroundColor: colors[index % colors.length] };
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
