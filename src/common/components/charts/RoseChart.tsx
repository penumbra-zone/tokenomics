"use client";

import * as echarts from "echarts";
import { EChartsOption, PieSeriesOption } from "echarts";
import { useEffect, useRef, useState } from "react";

import { CHART_PALETTES, COLORS } from "@/common/helpers/colors";
import { getCustomTooltipConfig } from "@/common/helpers/customTooltip";
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
  showAnimation?: boolean;
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

export default function RoseChart({
  data,
  seriesName,
  labelFormatter,
  minHeight = 320,
  style = {},
  showAnimation = true,
}: RoseChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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

    // Convert data to format expected by getCustomTooltipConfig
    const tooltipData = sortedData.map((item) => ({
      category: item.name,
      amount: item.value,
    }));

    // Mobile-responsive configuration
    const responsiveConfig = {
      radius: isMobile ? [30, 100] : [50, 150],
      center: isMobile ? ["50%", "40%"] : ["50%", "50%"], // Move chart up more on mobile for legend space
      labelFontSize: isMobile ? 11 : 14,
      labelLineLength: isMobile ? 8 : 15,
      labelLineLength2: isMobile ? 12 : 25,
      legendItemGap: isMobile ? 8 : 10,
      legendItemSize: isMobile ? 16 : 20,
    };

    const option: EChartsOption = {
      backgroundColor: "transparent",
      series: [
        {
          name: seriesName,
          type: "pie",
          radius: responsiveConfig.radius,
          center: responsiveConfig.center,
          roseType: "radius",
          itemStyle: {
            borderRadius: isMobile ? 4 : 8,
          },
          animation: showAnimation,
          minAngle: isMobile ? 15 : 10,
          avoidLabelOverlap: true,
          data: chartDataSource.map((item) => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: {
                type: "radial",
                x: chart.getWidth() / 2,
                y: chart.getHeight() / 2,
                r: chart.getHeight() / 2.5,
                color: item.baseColorObj.DEFAULT,
                colorStops: [
                  { offset: 0, color: item.baseColorObj.dark },
                  { offset: 1, color: item.baseColorObj.DEFAULT },
                ],
                global: true,
              },
              borderRadius: isMobile ? 4 : 8,
            },
            emphasis: {
              focus: "series",
              scaleSize: isMobile ? 5 : 10,
              itemStyle: {
                shadowBlur: isMobile ? 5 : 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          })),
          label: {
            show: !isMobile, // Hide labels on mobile to reduce clutter
            position: "outside",
            formatter: labelFormatter || ((params: any) => `${params.name}  ${params.value}`),
            color: COLORS.neutral[50],
            fontSize: responsiveConfig.labelFontSize,
            alignTo: "labelLine",
            bleedMargin: 5,
          },
          labelLine: {
            show: !isMobile,
            length: responsiveConfig.labelLineLength,
            length2: responsiveConfig.labelLineLength2,
            smooth: false,
            lineStyle: {
              color: COLORS.neutral[50],
              width: 1,
            },
          },
        } as PieSeriesOption,
      ],
      legend: {
        left: isMobile ? "center" : "left",
        top: isMobile ? "bottom" : "center",
        bottom: isMobile ? 5 : undefined,
        orient: isMobile ? "horizontal" : "vertical",
        itemGap: responsiveConfig.legendItemGap,
        itemWidth: responsiveConfig.legendItemSize,
        itemHeight: responsiveConfig.legendItemSize,
        icon: "circle",
        textStyle: {
          color: COLORS.neutral[50],
          fontFamily: FONT_FAMILIES.primary,
          fontSize: isMobile ? 11 : 14,
        },
        // Mobile-specific legend formatting with 2-row support
        ...(isMobile && {
          // Remove scroll type to allow natural wrapping
          width: "95%", // Use most of the width to encourage wrapping
          itemGap: 8, // Comfortable spacing between items
          // Calculate approximate items per row (adjust based on your typical data)
          // ECharts will automatically wrap when width is constrained
          formatter: (name: string) => {
            // Truncate long names on mobile to ensure consistent sizing
            return name.length > 10 ? name.substring(0, 10) + "..." : name;
          },
        }),
      },
      // Use the custom tooltip configuration from SupplyAllocationChart
      tooltip: getCustomTooltipConfig(tooltipData) as any,
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
  }, [data, seriesName, labelFormatter, isMobile]);

  return (
    <div
      ref={chartRef}
      style={{
        minHeight: isMobile ? Math.max(minHeight * 0.9, 300) : minHeight, // Slightly taller for legend space
        height: "100%",
        ...style,
      }}
    />
  );
}
