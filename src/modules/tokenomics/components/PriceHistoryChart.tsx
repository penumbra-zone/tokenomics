'use client';

import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

interface PriceHistoryChartProps {
  data: Array<{ date: string; price: number }>;
}

export default function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: ${c}'
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.date),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '${value}'
      }
    },
    series: [
      {
        name: 'Price',
        type: 'line',
        data: data.map(item => item.price),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#8884d8'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(136, 132, 216, 0.5)'
              },
              {
                offset: 1,
                color: 'rgba(136, 132, 216, 0.1)'
              }
            ]
          }
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '3%',
      containLabel: true
    }
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