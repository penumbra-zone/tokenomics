"use client";

import * as echarts from "echarts";

import { useEffect, useRef } from "react";

import { COLORS } from "@/common/helpers/colors";
import { getCustomTooltipConfig } from "@/common/helpers/customTooltip";
import { FONT_FAMILIES, TEXT_COLORS } from "@/common/helpers/typography";

// Define the SupplyAllocation interface
interface SupplyAllocation {
  category: string;
  amount: number;
}

interface SupplyAllocationChartProps {
  data: SupplyAllocation[];
  showAnimation?: boolean;
}

export default function SupplyAllocationChart({ data, showAnimation = true }: SupplyAllocationChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });

    // Brand gradients
    const gradients = [
      {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: COLORS.primary.DEFAULT },
          { offset: 1, color: COLORS.primary.dark },
        ],
      },
      {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: COLORS.secondary.DEFAULT },
          { offset: 1, color: COLORS.secondary.dark },
        ],
      },
    ];

    const chartData = data.map((item, idx) => ({
      value: item.amount,
      name: item.category,
      itemStyle: { color: gradients[idx] },
    }));

    chart.setOption({
      series: [
        {
          name: "Supply Allocation",
          type: "pie",
          radius: ["60%", "100%"],
          center: ["50%", "70%"],
          startAngle: 180,
          endAngle: 360,
          itemStyle: { borderRadius: 7 },
          label: { show: false },
          labelLine: { show: false },
          data: chartData,
        },
      ],
      animation: showAnimation,
      legend: {
        bottom: "10%",
        left: "center",
        itemWidth: 20,
        itemHeight: 20,
        itemGap: 10,
        icon: "circle",
        textStyle: {
          color: COLORS.neutral[50],
          fontFamily: FONT_FAMILIES.primary,
        },
      },
      textStyle: {
        fontFamily: FONT_FAMILIES.primary,
        color: TEXT_COLORS.primary,
      },
      tooltip: getCustomTooltipConfig(data),
    });

    function handleResize() {
      chart.resize();
    }
    window.addEventListener("resize", handleResize);
    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [data]);

  return <div ref={chartRef} className="w-full h-full justify-center items-center" />;
}
