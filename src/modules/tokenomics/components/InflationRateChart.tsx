import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { PriceHistory } from "@/store/api/tokenomicsApi";

interface InflationRateChartProps {
  data: PriceHistory[];
}

interface ChartDataItem {
  date: string;
  rate: number;
}

export default function InflationRateChart({ data }: InflationRateChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    // Calculate inflation rate based on price changes
    const chartData: ChartDataItem[] = data.map((item, index) => {
      if (index === 0) return { date: item.date, rate: 0 };

      const prevPrice = data[index - 1].price;
      const currentPrice = item.price;
      const rate = ((currentPrice - prevPrice) / prevPrice) * 100;

      return {
        date: item.date,
        rate: rate,
      };
    });

    const option = {
      tooltip: {
        trigger: "axis",
        formatter: (params: any[]) => {
          const param = params[0];
          return `${new Date(
            param.name
          ).toLocaleDateString()}: ${param.value.toFixed(2)}%`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: chartData.map((item) => item.date),
        axisLabel: {
          formatter: (value: string) => new Date(value).toLocaleDateString(),
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value: number) => `${value.toFixed(2)}%`,
        },
      },
      series: [
        {
          type: "line",
          data: chartData.map((item) => item.rate),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: "#8884d8",
          },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
}
