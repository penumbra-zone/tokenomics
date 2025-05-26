import * as echarts from "echarts";
import { EChartsOption, PieSeriesOption } from "echarts";
import { useEffect, useRef } from "react";

import { formatNumber } from "@/lib/utils";
import { BurnMetrics } from "@/store/api/tokenomicsApi";
import { COLORS, CHART_PALETTES } from "@/common/helpers/colors"; // Ensure CHART_PALETTES is imported
import { FONT_FAMILIES } from "@/common/helpers/typography";

interface BurnMetricsChartProps {
  data: BurnMetrics;
}

export default function BurnMetricsChart({ data }: BurnMetricsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data || !data.bySource) return;

    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });

    let rawChartData = [
      { name: 'Auctions Burns', value: data.bySource.auctionBurns },
      { name: 'DEX Burns', value: data.bySource.dexBurns },
      { name: 'Transaction Fees', value: data.bySource.transactionFees },
      { name: 'DEX Arbitrage', value: data.bySource.dexArbitrage },
    ];

    rawChartData.sort((a, b) => b.value - a.value);

    const chartDataSource = rawChartData.map((item, index) => ({
      ...item,
      baseColorObj: CHART_PALETTES.categorical[index % CHART_PALETTES.categorical.length],
    }));

    const option: EChartsOption = {
      backgroundColor: "transparent",
      series: [
        {
          name: "Token Burned by Source",
          type: 'pie',
          radius: [50, 150], 
          center: ['50%', '50%'],
          roseType: 'radius',
          itemStyle: {
            borderRadius: 8,
          },
          avoidLabelOverlap: true,
          data: chartDataSource.map(item => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: {
                type: 'radial',
                x: chart.getWidth() / 2,
                y: chart.getHeight() / 2,
                r: chart.getHeight() / 3,
                color: item.baseColorObj.DEFAULT,
                colorStops: [
                  { offset: 0, color: item.baseColorObj.dark }, 
                  { offset: 1, color: item.baseColorObj.DEFAULT } 
                ],
                global: true
              },
              borderRadius: 8,
            },
            emphasis: {
              focus: 'series',
              scaleSize: 10,
               itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          })),
          legend: {
            bottom: "center",
            left: "10%",
            itemWidth: 20,
            itemHeight: 20,
            itemGap: 10,
            icon: "circle",
            textStyle: {
              color: COLORS.neutral[50],
              fontFamily: FONT_FAMILIES.primary,
            },
          },
          label: {
            show: true,
            position: 'outside',
            formatter: (params: any) => {
              return `${params.name}  ${formatNumber(params.value)}` // `{circle|●|${params.color.color}} ${params.name}  ${formatNumber(params.value)}`;
            },
            // Used to try to get the label with circle to work
            // rich: {
            //   circle: {
            //     fontSize: 14,
            //     padding: [0, 6, 0, 0],
            //     color: '#000',
            //   },
            // },
            color: COLORS.neutral[50],
            fontSize: 14,
            alignTo: 'labelLine',
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
        left: 'left',
        top: 'center',
        orient: 'vertical',
        itemGap: 10,
        itemWidth: 20,
        itemHeight: 20,
        icon: 'circle',
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
  }, [data]);

  return (
    <div
      ref={chartRef}
      style={{ minHeight: 320 }}
    />
  );
}
