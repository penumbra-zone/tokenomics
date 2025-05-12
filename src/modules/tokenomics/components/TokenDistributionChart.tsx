'use client';

import React from 'react';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { TokenDistribution } from '@/store/api/tokenomicsApi';
import { useTheme } from 'next-themes';

interface TokenDistributionChartProps {
  data: TokenDistribution[];
}

export default function TokenDistributionChart({ data }: TokenDistributionChartProps) {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {d}%',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      padding: 5,
      textStyle: {
        color: isDark ? '#fff' : '#222',
      },
    },
    series: [
      {
        name: 'Token Distribution',
        type: 'pie',
        radius: '60%',
        center: ['60%', '60%'],
        data: data.map((item) => ({
          value: item.percentage,
          name: `${item.category}: ${item.percentage}%`,
        })),
        label: {
          color: isDark ? '#fff' : '#222',
        },
        labelLine: {
          lineStyle: {
            color: isDark ? '#fff' : '#222',
          },
        },
      },
    ]
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {/* @ts-ignore */}
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
} 