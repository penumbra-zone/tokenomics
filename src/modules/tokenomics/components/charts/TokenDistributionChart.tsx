"use client";

import RoseChart, { RoseChartDataItem } from "@/common/components/charts/RoseChart";
import { formatNumber } from "@/lib/utils";
import { TokenDistribution } from "@/store/api/tokenomicsApi";

interface TokenDistributionChartProps {
  data: TokenDistribution[];
  showAnimation?: boolean;
}

export default function TokenDistributionChart({ data, showAnimation = true }: TokenDistributionChartProps) {
  if (!data || data.length === 0) return null;

  const chartData: RoseChartDataItem[] = data.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  const labelFormatter = (params: any) => {
    return `${params.name}  ${formatNumber(params.value, 0)}`;
  };

  return (
    <RoseChart 
      data={chartData}
      seriesName="Token Distribution"
      labelFormatter={labelFormatter}
      showAnimation={showAnimation}
    />
  );
}
