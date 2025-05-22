"use client";

import * as echarts from "echarts";

import { useEffect, useRef } from "react";

import { useTheme } from "next-themes";

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
          type: 'pie',
          radius: ['60%', '100%'],
          center: ['50%', '70%'],
          startAngle: 180,
          endAngle: 360,          
          itemStyle: { borderRadius: 7 },
          label: { show: false },
          labelLine: { show: false },
          hoverAnimation: false,
          data: chartData,
        },
      ],
      legend: {
        bottom: '10%',
        left: 'center',
        itemWidth: 20,
        itemHeight: 20,
        itemGap: 10,
        icon: 'circle',
        textStyle: {
          color: COLORS.neutral[50],
        },
      },
      textStyle: {
        fontFamily: "Poppins, sans-serif",
        color: COLORS.neutral[950],
      },
      tooltip: {
        trigger: "item",
      },
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

  // Legend data and color mapping
  const legendData = [...data].sort((a, b) => b.amount - a.amount);
  const totalForLegend = legendData.reduce((sum, item) => sum + item.amount, 0);
  // Use the same color logic as the chart
  const legendColors = [COLORS.primary.DEFAULT, COLORS.secondary.DEFAULT];

  return (
    <div ref={chartRef} className="w-full h-full justify-center items-center" />
  );
}
