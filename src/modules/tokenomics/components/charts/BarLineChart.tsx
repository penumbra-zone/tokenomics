"use client";

import type { EChartsOption, SeriesOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";

import { CHART_PALETTES, COLORS } from "@/common/helpers/colors";
import { getCustomTooltipConfig } from "@/common/helpers/customTooltip";
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
  const themeColors = useMemo(
    () => ({
      primaryColor: COLORS.primary.DEFAULT,
      barGradient: [CHART_PALETTES.sequential[1], CHART_PALETTES.sequential[0]],
    }),
    []
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
      seriesArray.push({
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

    return seriesArray;
  }, [
    showBars,
    showLine,
    showArea,
    filteredData,
    areaLabel,
    barGradientColors,
    lineColor,
    themeColors,
  ]);

  // Memoize the complete chart option
  const option = useMemo((): EChartsOption => {
    return {
      backgroundColor: "transparent",
      tooltip: tooltipFormatter
        ? {
            trigger: "axis",
            backgroundColor: "#2263621A",
            extraCssText: "backdrop-filter: blur(6px);",
            borderRadius: 8,
            confine: true,
            textStyle: {
              color: COLORS.neutral[50],
              fontFamily: FONT_FAMILIES.primary,
              fontSize: 12,
            },
            formatter: tooltipFormatter as any,
          }
        : (getCustomTooltipConfig(
            [], // Empty data array for time-series charts
            areaLabel, // Title
            "axis", // Trigger type
            lineColor || themeColors.primaryColor, // Line color
            yLabelFormatter // Value formatter
          ) as any),
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
  }, [
    tooltipFormatter,
    areaLabel,
    lineColor,
    themeColors,
    yLabelFormatter,
    filteredData,
    axisConfig,
    series,
  ]);

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
