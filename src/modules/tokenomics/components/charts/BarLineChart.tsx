"use client";

import type { EChartsOption, SeriesOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";

import { COLORS } from "@/common/helpers/colors";
import { getCustomTooltipConfig } from "@/common/helpers/customTooltip";
import { defaultThemeColors, ThemeColors } from "@/common/styles/themeColors";

export interface BarLineChartData {
  x: string;
  y: number;
}

interface BarLineChartProps {
  data: BarLineChartData[];
  yLabelFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
  selectedDay: number;
  areaLabel?: string;
  minYZero?: boolean;
  showLine?: boolean;
  showBars?: boolean;
  showArea?: boolean;
  themeColors?: ThemeColors;
}

export default function BarLineChart({
  data,
  yLabelFormatter = (v) => v.toString(),
  tooltipFormatter,
  selectedDay,
  areaLabel = "Value",
  showLine = false,
  showBars = true,
  showArea = false,
  minYZero = true,
  themeColors = defaultThemeColors,
}: BarLineChartProps) {
  const chartThemeColors = useMemo(
    () => ({
      primaryColor: themeColors.primary.value.DEFAULT,
      barGradient: [themeColors.primary.value.dark, themeColors.primary.value.DEFAULT],
      lineColor: themeColors.primary.value.DEFAULT,
    }),
    [themeColors]
  );

  // Memoize filtered data based on data and selectedDay
  const filteredData = useMemo(() => {
    return data.slice(-selectedDay);
  }, [data, selectedDay]);

  // Memoize axis calculations based on filtered data
  const axisConfig = useMemo(() => {
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

    return {
      yMin,
      yMax,
      interval,
      xAxisLabels,
      xAxisLabelNames,
    };
  }, [filteredData, selectedDay, minYZero]);

  // Memoize series configuration
  const series = useMemo(() => {
    const seriesArray: SeriesOption[] = [];

    if (showBars) {
      seriesArray.push({
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
                color: chartThemeColors.barGradient[0],
              },
              {
                offset: 1,
                color: chartThemeColors.barGradient[1],
              },
            ],
          },
        },
        emphasis: {
          itemStyle: {
            color: chartThemeColors.primaryColor,
          },
        },
        z: 1,
      });
    }

    if (showLine) {
      seriesArray.push({
        name: `${areaLabel} Line`,
        type: "line",
        data: filteredData.map((item) => item.y),
        smooth: false,
        lineStyle: {
          width: 5,
          color: chartThemeColors.lineColor,
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
                    color: chartThemeColors.lineColor,
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
            borderColor: chartThemeColors.lineColor,
            borderWidth: 5,
            color: chartThemeColors.barGradient[0],
          },
        },
        itemStyle: {
          color: chartThemeColors.lineColor,
          borderWidth: 0,
        },
        z: 2,
      });
    }

    return seriesArray;
  }, [showBars, showLine, showArea, filteredData, areaLabel, chartThemeColors]);

  // Memoize the complete chart option
  const option = useMemo((): EChartsOption => {
    return {
      backgroundColor: "transparent",
      tooltip: getCustomTooltipConfig(
        [], // Empty data array for time-series charts
        areaLabel, // Title
        "axis", // Trigger type
        chartThemeColors.lineColor, // Line color
        tooltipFormatter
      ) as any,
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
          color: themeColors.textPrimary.value,
          fontSize: 12,
          formatter: (value: string) => {
            const idx = axisConfig.xAxisLabels.indexOf(value);
            if (idx !== -1) return axisConfig.xAxisLabelNames[idx];
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
        min: axisConfig.yMin,
        max: axisConfig.yMax,
        interval: axisConfig.interval,
        axisLabel: {
          color: themeColors.textPrimary.value,
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
  }, [
    tooltipFormatter,
    areaLabel,
    chartThemeColors,
    themeColors,
    yLabelFormatter,
    filteredData,
    axisConfig,
    series,
  ]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
}
