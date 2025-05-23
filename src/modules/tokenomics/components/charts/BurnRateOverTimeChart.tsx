"use client";

import * as echarts from 'echarts';
import { useEffect, useRef, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { format } from 'date-fns';
import { COLORS } from '@/common/helpers/colors';

interface BurnRateDataPoint {
  date: string; // Expecting date strings like "YYYY-MM-DD"
  value: number;
}

interface BurnRateOverTimeChartProps {
  // data?: BurnRateDataPoint[]; // Assuming data might be added later, keep it optional if it has a default
  timeRange?: '7d' | '30d' | '90d'; // Make timeRange optional as it has a default
}

// Mock data for different time ranges
const mockData7d: BurnRateDataPoint[] = Array.from({ length: 7 }, (_, i) => {
  const day = new Date('2024-09-01');
  day.setDate(day.getDate() + i);
  return { date: format(day, 'yyyy-MM-dd'), value: Math.floor(Math.random() * 15) + 10 };
});

const mockData30d: BurnRateDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const day = new Date('2024-08-01');
  day.setDate(day.getDate() + i);
  return { date: format(day, 'yyyy-MM-dd'), value: Math.floor(Math.random() * 40) + 10 };
});

const mockData90d: BurnRateDataPoint[] = Array.from({ length: 90 }, (_, i) => {
  const day = new Date('2024-07-01');
  day.setDate(day.getDate() + i);
  return { date: format(day, 'yyyy-MM-dd'), value: Math.floor(Math.random() * 65) + 5 };
});

export function BurnRateOverTimeChart({
  timeRange = '7d' // Default value for timeRange directly in destructuring
}: BurnRateOverTimeChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const chartData = useMemo(() => {
    switch (timeRange) {
      case '7d':
        return mockData7d;
      case '30d':
        return mockData30d;
      case '90d':
        return mockData90d;
      default:
        return mockData7d;
    }
  }, [timeRange]);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, undefined, { renderer: 'svg' });
    const isDark = resolvedTheme === 'dark';
    
    // Use colors from COLORS.ts
    const textColor = isDark ? COLORS.neutral[400] : COLORS.neutral[600]; 
    const lineColor = COLORS.primary.DEFAULT; 
    const areaColorStart = COLORS.primary.DEFAULT; // Use primary color for start
    const areaColorEnd = COLORS.primary.light;   // Use a lighter shade or transparent primary

    // It's good practice to ensure opacity is handled correctly with hex colors for gradients
    // ECharts handles this, but if manual RGBA strings were needed: hexToRgb from your colorUtils would be used.

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: lineColor,
            opacity: 0.5,
            width: 1
          }
        },
        formatter: (params: any) => {
          const param = params[0];
          const date = format(new Date(param.axisValueLabel), 'MMM dd, yyyy');
          // Using Tailwind classes for tooltip styling, ensuring they are available globally or defined within the component scope
          return `
            <div class="bg-neutral-800 p-3 rounded-md border border-neutral-700 shadow-lg">
              <div class="text-sm text-neutral-300">${date}</div>
              <div class="text-sm" style="color: ${COLORS.primary.light}">Tokens burned: ${param.value.toLocaleString()}</div>
            </div>
          `;
        },
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        padding: 0,
        extraCssText: 'box-shadow: none;', 
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: chartData.map(item => item.date),
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            formatter: (value: string) => format(new Date(value), 'MMM dd'),
            color: textColor,
            fontSize: 12,
            padding: [10, 0, 0, 0]
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            lineStyle: {
              color: isDark ? COLORS.neutral[700] : COLORS.neutral[300],
              type: 'dashed',
            },
          },
          axisLabel: {
            formatter: '{value}k',
            color: textColor,
            fontSize: 12,
          },
        },
      ],
      series: [
        {
          name: 'Tokens Burned',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: lineColor,
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: areaColorStart, // Already a hex color from COLORS
              },
              {
                offset: 1,
                color: areaColorEnd, // Already a hex color, consider adding opacity or using a lighter shade
              },
            ]),
            opacity: isDark ? 0.6 : 0.7 // Adjust opacity for light/dark themes
          },
          data: chartData.map(item => item.value),
          emphasis: {
            focus: 'series',
            lineStyle: {
                width: 2.5,
            }
          }
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [chartData, resolvedTheme]);

  return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
} 