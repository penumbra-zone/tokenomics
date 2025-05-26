"use client";

import type { EChartsOption, SeriesOption } from "echarts";
import ReactECharts from "echarts-for-react";

import { CHART_PALETTES, COLORS } from "@/common/helpers/colors";

export interface BarLineChartData {
  x: string;
  y: number;
}

interface BarLineChartProps {
  data: BarLineChartData[];
  yLabelFormatter?: (value: number) => string;
  tooltipFormatter?: (params: any[]) => string;
  selectedDay: number;
  areaLabel?: string;
  yPadding?: number;
  barGradientColors?: [string, string];
  lineColor?: string;
  minYZero?: boolean;
  showLine?: boolean;
  showBars?: boolean;
}

export default function BarLineChart({
  data,
  yLabelFormatter = (v) => v.toString(),
  tooltipFormatter,
  selectedDay,
  areaLabel = "Value",
  yPadding = 0.2,
  barGradientColors,
  lineColor,
  showLine = false,
  showBars = true,
  minYZero = true,
}: BarLineChartProps) {
  const themeColors = {
    primaryColor: COLORS.primary.DEFAULT,
    barGradient: [CHART_PALETTES.sequential[1], CHART_PALETTES.sequential[0]],
  };

  // Only show the last N days based on selectedDay
  const filteredData = data.slice(-selectedDay);

  // Dynamic y-axis min/max
  const values = filteredData.map((item) => item.y);
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 3;
  const yMin = minYZero ? Math.max(0, minValue - yPadding) : minValue - yPadding;
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
    `${selectedDay}d`,
    `${Math.round((2 * selectedDay) / 3)}d`,
    `${Math.round(selectedDay / 3)}d`,
    "Now",
  ].slice(0, xAxisLabels.length);

  const series: SeriesOption[] = [];

  if (showBars) {
    series.push({
      name: `${areaLabel} Bars`,
      type: "bar",
      data: filteredData.map((item) => item.y),
      barWidth: "70%",
      itemStyle: {
        borderRadius: 4,
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
    });
  }

  if (showLine) {
    series.push({
      name: `${areaLabel} Line`,
      type: "line",
      data: filteredData.map((item) => item.y),
      smooth: false,
      lineStyle: {
        width: 5,
        color: lineColor || themeColors.primaryColor,
      },
      emphasis: {
        scale: 4,
        itemStyle: {
          borderColor: lineColor,
          borderWidth: 5,
          color: themeColors.barGradient[0],
        },
      },
      itemStyle: {
        color: lineColor || themeColors.primaryColor,
        borderWidth: 0,
      },
      z: 2,
    });
  }

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
      left: "0%",
      right: "0%",
      bottom: "10%",
      top: "10%",
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
    series,
    legend: { show: false },
    toolbox: { show: false },
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {/* @ts-ignore */}
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
}
