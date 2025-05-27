"use client";

import * as echarts from "echarts";
import { EChartsOption, PieSeriesOption } from "echarts";
import { useEffect, useRef } from "react";

import { CHART_PALETTES, COLORS } from "@/common/helpers/colors";
import { FONT_FAMILIES } from "@/common/helpers/typography";

export interface RoseChartDataItem {
  name: string;
  value: number;
}

export interface RoseChartProps {
  data: RoseChartDataItem[];
  seriesName: string;
  labelFormatter?: (params: any) => string;
  minHeight?: number;
  style?: React.CSSProperties;
}

export default function RoseChart({
  data,
  seriesName,
  labelFormatter,
  minHeight = 320,
  style = {},
}: RoseChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });

    // Sort data by value (largest first)
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    const chartDataSource = sortedData.map((item, index) => ({
      ...item,
      baseColorObj: CHART_PALETTES.categorical[index % CHART_PALETTES.categorical.length],
    }));

    const option: EChartsOption = {
      backgroundColor: "transparent",
      series: [
        {
          name: seriesName,
          type: "pie",
          radius: [50, 150],
          center: ["50%", "50%"],
          roseType: "radius",
          itemStyle: {
            borderRadius: 8,
          },
          minAngle: 10,
          avoidLabelOverlap: true,
          data: chartDataSource.map((item) => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: {
                type: "radial",
                x: chart.getWidth() / 2,
                y: chart.getHeight() / 2,
                r: chart.getHeight() / 2,
                color: item.baseColorObj.DEFAULT,
                colorStops: [
                  { offset: 0, color: item.baseColorObj.dark },
                  { offset: 1, color: item.baseColorObj.DEFAULT },
                ],
                global: true,
              },
              borderRadius: 8,
            },
            emphasis: {
              focus: "series",
              scaleSize: 10,
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          })),
          label: {
            show: true,
            position: "outside",
            formatter: labelFormatter || ((params: any) => `${params.name}  ${params.value}`),
            color: COLORS.neutral[50],
            fontSize: 14,
            alignTo: "labelLine",
            bleedMargin: 5,
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 25,
            smooth: false,
            lineStyle: {
              color: COLORS.neutral[50],
              width: 1,
            },
          },
        } as PieSeriesOption,
      ],
      legend: {
        left: "left",
        top: "center",
        orient: "vertical",
        itemGap: 10,
        itemWidth: 20,
        itemHeight: 20,
        icon: "circle",
        textStyle: {
          color: COLORS.neutral[50],
          fontFamily: FONT_FAMILIES.primary,
        },
      },
    };

    chart.setOption(option);

    function handleResize() {
      chart.resize();
    }
    window.addEventListener("resize", handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [data, seriesName, labelFormatter]);

  return (
    <div
      ref={chartRef}
      style={{
        minHeight,
        height: "100%",
        ...style,
      }}
    />
  );
}
