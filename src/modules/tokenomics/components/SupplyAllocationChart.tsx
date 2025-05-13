"use client";

import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { useTheme } from "next-themes";

interface SupplyAllocationChartProps {
  genesisAllocation: number;
  issuedSinceLaunch: number;
}

export default function SupplyAllocationChart({
  genesisAllocation,
  issuedSinceLaunch,
}: SupplyAllocationChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [primaryColor, setPrimaryColor] = useState("#f49c43");
  const [secondaryColor, setSecondaryColor] = useState("#2a7a8c");

  // Get CSS variable for primary color
  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryHsl = rootStyles.getPropertyValue("--primary").trim();
    const secondaryHsl = rootStyles.getPropertyValue("--secondary").trim();

    // Convert HSL values to hex
    const [h, s, l] = primaryHsl.split(" ").map((val) => parseFloat(val));
    setPrimaryColor(hslToHex(h, s, l));

    const [hSec, sSec, lSec] = secondaryHsl
      .split(" ")
      .map((val) => parseFloat(val));
    setSecondaryColor(hslToHex(hSec, sSec, lSec));
  }, [resolvedTheme]);

  // HSL to Hex conversion helper
  function hslToHex(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });

    const isDark = resolvedTheme === "dark";
    const backgroundColor = "transparent";
    const textColor = isDark ? "#fff" : "#222";
    const legendTextColor = isDark ? primaryColor : primaryColor;
    const colors = [
      primaryColor, // Primary color
      secondaryColor, // Secondary color - Teal
    ];

    const total = genesisAllocation + issuedSinceLaunch;
    const data = [
      {
        value: genesisAllocation,
        name: "Genesis Allocation",
        itemStyle: { color: colors[0] },
      },
      {
        value: issuedSinceLaunch,
        name: "Issued Since Launch",
        itemStyle: { color: colors[1] },
      },
    ];

    chart.setOption({
      backgroundColor,
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
        backgroundColor: isDark ? "#222" : "#fff",
        borderColor: primaryColor,
        textStyle: { color: textColor },
      },
      legend: {
        orient: "vertical",
        left: 20,
        top: "center",
        textStyle: {
          color: legendTextColor,
          fontWeight: 600,
          fontSize: 14,
        },
        itemWidth: 18,
        itemHeight: 12,
      },
      series: [
        {
          name: "Supply Allocation",
          type: "pie",
          radius: ["75%", "85%"],
          center: ["60%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: backgroundColor,
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: isDark
              ? `rgba(${hexToRgb(primaryColor)},0.15)`
              : `rgba(${hexToRgb(primaryColor)},0.10)`,
          },
          label: {
            show: true,
            position: "center",
            formatter: () =>
              total > 0
                ? `${((genesisAllocation / total) * 100).toFixed(
                    1
                  )}%\nGenesis\n${((issuedSinceLaunch / total) * 100).toFixed(
                    1
                  )}%\nIssued`
                : "-",
            color: textColor,
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 22,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data,
        },
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
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
  }, [
    genesisAllocation,
    issuedSinceLaunch,
    resolvedTheme,
    primaryColor,
    secondaryColor,
  ]);

  // Hex to RGB helper for rgba
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )}`
      : "244, 156, 67"; // Fallback to primary color
  }

  return (
    <div
      ref={chartRef}
      className="w-full h-full rounded-xl bg-background/60 border border-border shadow"
      style={{ minHeight: 320 }}
    />
  );
}
