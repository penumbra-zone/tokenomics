"use client";

import type { EChartsOption, SeriesOption } from "echarts";
import ReactECharts from "echarts-for-react";

import { CHART_PALETTES, COLORS } from "@/common/helpers/colors";
import { FONT_FAMILIES } from "@/common/helpers/typography";

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
  barGradientColors?: [string, string];
  lineColor?: string;
  minYZero?: boolean;
  showLine?: boolean;
  showBars?: boolean;
  showArea?: boolean;
}

export default function BarLineChart({
  data,
  yLabelFormatter = (v) => v.toString(),
  tooltipFormatter,
  selectedDay,
  areaLabel = "Value",
  barGradientColors,
  lineColor,
  showLine = false,
  showBars = true,
  showArea = false,
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
  const yPadding = (maxValue - minValue) * 0.2;
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
      areaStyle: showArea
        ? {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0.6,
                  color: lineColor || themeColors.primaryColor,
                },
                {
                  offset: 1,
                  color: COLORS.neutral[900],
                },
              ],
            },
          }
        : undefined,
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
      backgroundColor: "#2263621A", // teal with alpha to match getCustomTooltipConfig
      extraCssText: "backdrop-filter: blur(6px);", // 60% blur effect
      borderRadius: 8,
      borderColor: lineColor || themeColors.primaryColor,
      borderWidth: 1,
      confine: true, // Ensures tooltip stays within chart boundaries
      textStyle: {
        color: COLORS.neutral[50],
        fontFamily: FONT_FAMILIES.primary,
        fontSize: 12,
      },
      formatter: tooltipFormatter
        ? (tooltipFormatter as any)
        : (((params: any[]) => {
            const dataPoint = params[0];
            return `<div style="min-width: 120px;">
              <div style="margin-bottom: 4px; color: ${COLORS.neutral[50]};">${dataPoint.axisValueLabel}</div>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${lineColor || themeColors.primaryColor}; margin-right: 8px;"></span>
                  <span style="color: ${COLORS.neutral[50]};">${areaLabel}</span>
                </div>
                <span style="color: ${COLORS.neutral[50]}; font-weight: 500; margin-left: 15px;">${dataPoint.value}</span>
              </div>
            </div>`;
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
        color: COLORS.neutral[50], // Using neutral color from our palette
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
        color: COLORS.neutral[50], // Using neutral color from our palette
        fontSize: 12,
        formatter: yLabelFormatter,
        margin: 12,
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: false,
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
