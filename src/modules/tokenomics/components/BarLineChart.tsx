"use client";

import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";

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
}

export default function BarLineChart({
  data,
  xLabels,
  yLabelFormatter = (v) => v.toString(),
  tooltipFormatter,
  areaLabel = "Value",
  yPadding = 0.2,
  barGradientColors = ["rgba(16,185,129,0.15)", "rgba(16,185,129,0.7)"],
  lineColor = "#10b981",
  areaGradientColors = ["rgba(16,185,129,0.18)", "rgba(16,185,129,0.01)"],
  minYZero = true,
}: BarLineChartProps) {
  // Dynamic y-axis min/max
  const values = data.map((item) => item.y);
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 3;
  const yMin = minYZero
    ? Math.max(0, minValue - yPadding)
    : minValue - yPadding;
  const yMax = maxValue + yPadding;
  const interval = (yMax - yMin) / 5;

  // X-axis label logic
  const xAxisLabels =
    xLabels && xLabels.length === 4
      ? data.length >= 4
        ? [
            data[0].x,
            data[Math.floor(data.length / 3)].x,
            data[Math.floor((2 * data.length) / 3)].x,
            data[data.length - 1].x,
          ]
        : data.map((item) => item.x)
      : undefined;

  const option: EChartsOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "#18181b",
      borderColor: lineColor,
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
      data: data.map((item) => item.x),
      axisLabel: {
        color: "#a3a3a3",
        fontSize: 12,
        formatter: (value: string, idx: number) => {
          if (xAxisLabels) {
            if (value === xAxisLabels[0]) return "30d";
            if (value === xAxisLabels[1]) return "20d";
            if (value === xAxisLabels[2]) return "10d";
            if (value === xAxisLabels[3]) return "Now";
            return "";
          }
          return value;
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
        color: "#a3a3a3",
        fontSize: 12,
        formatter: yLabelFormatter,
        margin: 12,
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#262626",
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: `${areaLabel} Bars`,
        type: "bar",
        data: data.map((item) => item.y),
        barWidth: "70%",
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: {
            type: "linear",
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              { offset: 0, color: barGradientColors[0] },
              { offset: 1, color: barGradientColors[1] },
            ],
          },
        },
        emphasis: {
          itemStyle: {
            color: lineColor,
          },
        },
        z: 1,
      },
      {
        name: `${areaLabel} Line`,
        type: "line",
        data: data.map((item) => item.y),
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: lineColor,
        },
        itemStyle: {
          color: lineColor,
          borderColor: "#fff",
          borderWidth: 1,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: areaGradientColors[0] },
              { offset: 1, color: areaGradientColors[1] },
            ],
          },
        },
        z: 2,
      },
    ],
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
