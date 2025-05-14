"use client";

import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { getPrimaryThemeColors } from "@/common/helpers/colorUtils";
import { COLORS, CHART_PALETTES } from "@/common/helpers/colors";

export interface BarLineChartData {
  x: string;
  y: number;
}

interface BarLineChartProps {
  data: BarLineChartData[];
  xLabels?: string[];
  yLabelFormatter?: (value: number) => string;
  tooltipFormatter?: (params: any[]) => string;
  areaLabel?: string;
  yPadding?: number;
  barGradientColors?: [string, string];
  lineColor?: string;
  areaGradientColors?: [string, string];
  minYZero?: boolean;
  dayOptions?: number[];
  defaultDays?: number;
  chartPalette?: keyof typeof CHART_PALETTES;
}

export default function BarLineChart({
  data,
  xLabels,
  yLabelFormatter = (v) => v.toString(),
  tooltipFormatter,
  areaLabel = "Value",
  yPadding = 0.2,
  barGradientColors,
  lineColor,
  areaGradientColors,
  minYZero = true,
  dayOptions = [7, 30, 90],
  defaultDays = 30,
  chartPalette = "sequential",
}: BarLineChartProps) {
  const [days, setDays] = useState(defaultDays);
  const { resolvedTheme } = useTheme();
  const [themeColors, setThemeColors] = useState({
    primaryColor: COLORS.primary.DEFAULT,
    barGradient: COLORS.gradients.primaryBar,
    areaGradient: COLORS.gradients.primaryFade,
  });

  // Get CSS variable for primary color
  useEffect(() => {
    setThemeColors(getPrimaryThemeColors());
  }, [resolvedTheme]);

  // Only show the last N days
  const filteredData = data.slice(-days);

  // Dynamic y-axis min/max
  const values = filteredData.map((item) => item.y);
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 3;
  const yMin = minYZero
    ? Math.max(0, minValue - yPadding)
    : minValue - yPadding;
  const yMax = maxValue + yPadding;
  const interval = (yMax - yMin) / 5;

  // X-axis label logic
  const xAxisLabels = [
    filteredData[0]?.x, // leftmost
    filteredData[Math.floor(filteredData.length / 3)]?.x,
    filteredData[Math.floor((2 * filteredData.length) / 3)]?.x,
    filteredData[filteredData.length - 1]?.x, // rightmost
  ].filter(Boolean);

  const xAxisLabelNames = [
    `${days}d`,
    `${Math.round((2 * days) / 3)}d`,
    `${Math.round(days / 3)}d`,
    "Now",
  ].slice(0, xAxisLabels.length);

  const option: EChartsOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "#18181b",
      borderColor: lineColor || themeColors.primaryColor,
      borderWidth: 1,
      textStyle: { color: "#fff" },
      formatter: tooltipFormatter
        ? (tooltipFormatter as any)
        : (((params: any[]) => {
            const bar = params.find((p: any) => p.seriesType === "bar");
            const line = params.find((p: any) => p.seriesType === "line");
            return `${
              bar.axisValueLabel || bar.name
            }<br/>${areaLabel}: <b>${line.data.toFixed(2)}</b>`;
          }) as any),
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: "18%",
      top: "6%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: filteredData.map((item) => item.x),
      axisLabel: {
        color: COLORS.neutral[400], // Using neutral color from our palette
        fontSize: 12,
        formatter: (value: string) => {
          const idx = xAxisLabels.indexOf(value);
          if (idx !== -1) return xAxisLabelNames[idx];
          return "";
        },
        margin: 16,
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      min: yMin,
      max: yMax,
      interval: interval,
      axisLabel: {
        color: COLORS.neutral[400], // Using neutral color from our palette
        fontSize: 12,
        formatter: yLabelFormatter,
        margin: 12,
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: COLORS.neutral[800], // Using neutral color from our palette
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: `${areaLabel} Bars`,
        type: "bar",
        data: filteredData.map((item) => item.y),
        barWidth: "70%",
        itemStyle: {
          borderRadius: [0, 0, 0, 0],
          color: {
            type: "linear",
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: barGradientColors?.[0] || themeColors.barGradient[0],
              },
              {
                offset: 1,
                color: barGradientColors?.[1] || themeColors.barGradient[1],
              },
            ],
          },
        },
        emphasis: {
          itemStyle: {
            color: lineColor || themeColors.primaryColor,
          },
        },
        z: 1,
      },
      {
        name: `${areaLabel} Line`,
        type: "line",
        data: filteredData.map((item) => item.y),
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: lineColor || themeColors.primaryColor,
        },
        itemStyle: {
          color: lineColor || themeColors.primaryColor,
          borderColor: "#fff",
          borderWidth: 0,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: areaGradientColors?.[0] || themeColors.areaGradient[0],
              },
              {
                offset: 1,
                color: areaGradientColors?.[1] || themeColors.areaGradient[1],
              },
            ],
          },
        },
        z: 2,
      },
    ],
    color: CHART_PALETTES[chartPalette],
    legend: { show: false },
    toolbox: { show: false },
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {/* Days filter */}
      <div className="flex items-center gap-2 mb-2">
        {dayOptions.map((opt) => (
          <button
            key={opt}
            className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
              days === opt
                ? "bg-primary text-black border-primary"
                : "bg-background/60 text-primary border-primary/40 hover:bg-primary/10"
            }`}
            onClick={() => setDays(opt)}
          >
            {opt}d
          </button>
        ))}
      </div>
      {/* @ts-ignore */}
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
}
