import * as echarts from "echarts";

import { useEffect, useRef, useState } from "react";

import { useTheme } from "next-themes";

import { formatNumber } from "@/lib/utils";
import { BurnMetrics } from "@/store/api/tokenomicsApi";

interface BurnMetricsChartProps {
  data: BurnMetrics;
}

export default function BurnMetricsChart({ data }: BurnMetricsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [primaryColor, setPrimaryColor] = useState("#f49c43");

  // Get CSS variable for primary color
  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryHsl = rootStyles.getPropertyValue("--primary").trim();

    // Convert HSL values to hex
    const [h, s, l] = primaryHsl.split(" ").map((val) => parseFloat(val));
    setPrimaryColor(hslToHex(h, s, l));
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

  // Hex to RGB helper for rgba
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "244, 156, 67"; // Fallback to amber
  }

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });
    const isDark = resolvedTheme === "dark";
    const textColor = isDark ? "#fff" : "#222";

    // Adjust the lighter shade for the gradient
    function getLighterShade(hex: string) {
      const rgb = hexToRgb(hex).split(", ").map(Number);
      const lighter = rgb.map((val) => Math.min(255, val + 40));
      return `rgb(${lighter.join(", ")})`;
    }

    const barGradient = {
      type: "linear",
      x: 0,
      y: 0,
      x2: 1,
      y2: 0,
      colorStops: [
        {
          offset: 0,
          color: primaryColor, // Primary color
        },
        {
          offset: 1,
          color: getLighterShade(primaryColor), // Lighter shade of primary
        },
      ],
    };
    const categories = ["Transaction Fees", "DEX Arbitrage", "Auction Burns", "DEX Burns"];
    const values = [
      data.bySource.transactionFees,
      data.bySource.dexArbitrage,
      data.bySource.auctionBurns,
      data.bySource.dexBurns,
    ];
    chart.setOption({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "none",
        },
        backgroundColor: isDark ? "#222" : "#fff",
        borderColor: primaryColor,
        textStyle: { color: textColor },
        formatter: (params: any) => {
          const value = params[0].value;
          return `${params[0].name}<br/>Burned: ${formatNumber(value)}`;
        },
      },
      grid: {
        left: 20,
        right: 50,
        top: 32,
        bottom: 24,
        containLabel: true,
      },
      xAxis: {
        type: "value",
        splitLine: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: textColor,
          fontWeight: 500,
          fontSize: 13,
          formatter: (value: number) => formatNumber(value),
        },
      },
      yAxis: {
        type: "category",
        data: categories,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          align: "right",
          color: textColor,
          fontWeight: 600,
          fontSize: 15,
        },
      },
      series: [
        {
          name: "Burned",
          type: "bar",
          data: values,
          barWidth: 16,
          itemStyle: {
            color: barGradient,
            borderRadius: 0,
            shadowBlur: 8,
            shadowColor: `rgba(${hexToRgb(primaryColor)}, ${isDark ? 0.33 : 0.22})`,
          },
          emphasis: {
            itemStyle: {
              opacity: 0.9,
              shadowBlur: 12,
              shadowColor: `rgba(${hexToRgb(primaryColor)}, ${isDark ? 0.5 : 0.4})`,
            },
            focus: "series",
            blurScope: "coordinateSystem",
          },
        },
      ],
    });
    function handleResize() {
      chart.resize();
    }
    window.addEventListener("resize", handleResize);
    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [data, resolvedTheme, primaryColor]);

  return (
    <div
      ref={chartRef}
      className="w-full h-full bg-background/60 border border-border shadow"
      style={{ minHeight: 320 }}
    />
  );
}
