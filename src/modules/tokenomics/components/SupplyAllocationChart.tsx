"use client";

import * as echarts from "echarts";

import React, { useEffect, useRef } from "react";

import { useTheme } from "next-themes";

import { getColorPalette, hexToRgb, shiftHue } from "@/common/helpers/colorUtils";
import { COLORS } from "@/common/helpers/colors";

// Define the SupplyAllocation interface
interface SupplyAllocation {
  category: string;
  amount: number;
}

interface SupplyAllocationChartProps {
  data: SupplyAllocation[];
}

export default function SupplyAllocationChart({ data }: SupplyAllocationChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });

    const isDark = resolvedTheme === "dark";
    const backgroundColor = "transparent"; // Kept for clarity, though echarts default usually works
    const colorPalette = getColorPalette();

    const chartData = data.map((item, index) => ({
      value: item.amount,
      name: item.category,
      itemStyle: {
        color: colorPalette[index % colorPalette.length],
      },
    }));

    const total = data.reduce((sum, item) => sum + item.amount, 0);

    chart.setOption({
      backgroundColor,
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          // Use any for params if specific type is complex
          return `${params.name}: ${params.value.toLocaleString()} (${params.percent}%)`;
        },
        backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral[50],
        borderColor: COLORS.primary.DEFAULT,
        textStyle: { color: isDark ? COLORS.neutral[50] : COLORS.neutral[900] },
      },
      legend: { show: false }, // Using custom legend below
      series: [
        {
          name: "Supply Allocation",
          type: "pie",
          radius: ["75%", "85%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: backgroundColor,
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "center",
            formatter: () => {
              if (total === 0) return "-";
              // Example: Display total in millions if large, or just the number
              const displayTotal =
                total > 1000000 ? `${(total / 1000000).toFixed(1)}M` : total.toLocaleString();
              return `${displayTotal}\nTotal Supply`;
            },
            color: isDark ? COLORS.neutral[50] : COLORS.neutral[900],
            fontSize: 16,
            fontWeight: "bold",
            lineHeight: 22,
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
          data: chartData,
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
  }, [data, resolvedTheme]);

  const legendData = [...data].sort((a, b) => b.amount - a.amount);
  const totalForLegend = legendData.reduce((sum, item) => sum + item.amount, 0);

  // Regenerate palette for legend to ensure consistency if data order changes
  // or if the number of items affects palette generation logic for series differently
  const legendColorPalette = Array.from({ length: legendData.length }, (_, i) => {
    if (legendData.length === 1) return COLORS.primary.DEFAULT;
    if (i === 0) return COLORS.primary.DEFAULT; // First item (largest) gets primary
    // For others, we might want a more deliberate palette or stick to the shifted hue
    // This example uses the same logic as series for simplicity.
    // Consider if legend should map directly to series colors if series data isn't re-sorted for chart.
    const originalIndex = data.findIndex((d) => d.category === legendData[i].category);
    if (originalIndex === 0) return COLORS.primary.DEFAULT;
    if (originalIndex === data.length - 1 && data.length > 1) return COLORS.secondary.DEFAULT;

    const shiftAmount = (30 * originalIndex) / Math.max(1, data.length - 1);
    return shiftHue(COLORS.primary.DEFAULT, shiftAmount);
  });

  return (
    <div className="w-full h-full rounded-xl bg-background/60 border border-border shadow p-4 flex flex-col">
      <div ref={chartRef} className="w-full flex-grow" style={{ minHeight: 200 }} />
      {data.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 pt-2 border-t border-border/50">
          {legendData.map((item, i) => (
            <div key={item.category} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: legendColorPalette[i] }}
              />
              <span className="text-sm font-medium text-foreground">{item.category}</span>
              <span className="text-xs text-muted-foreground">
                {totalForLegend > 0 ? ((item.amount / totalForLegend) * 100).toFixed(1) : 0}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
