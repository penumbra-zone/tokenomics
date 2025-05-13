"use client";

import React from "react";
import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";

interface SupplyAllocationChartProps {
  genesisAllocation: number;
  issuedSinceLaunch: number;
}

export default function SupplyAllocationChart({
  genesisAllocation,
  issuedSinceLaunch,
}: SupplyAllocationChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const totalSupply = genesisAllocation + issuedSinceLaunch;
  const genesisPercentage = (genesisAllocation / totalSupply) * 100;
  const issuedPercentage = (issuedSinceLaunch / totalSupply) * 100;

  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {d}%",
    },
    legend: {
      orient: "vertical",
      left: "left",
      padding: 5,
      textStyle: {
        color: isDark ? "#fff" : "#222",
      },
    },
    series: [
      {
        name: "Supply Allocation",
        type: "pie",
        radius: "60%",
        center: ["60%", "60%"],
        data: [
          {
            value: genesisAllocation,
            name: `Genesis Allocation: ${genesisPercentage.toFixed(1)}%`,
          },
          {
            value: issuedSinceLaunch,
            name: `Issued Since Launch: ${issuedPercentage.toFixed(1)}%`,
          },
        ],
        label: {
          color: isDark ? "#fff" : "#222",
        },
        labelLine: {
          lineStyle: {
            color: isDark ? "#fff" : "#222",
          },
        },
      },
    ],
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
