import RoseChart, { RoseChartDataItem } from "@/common/components/charts/RoseChart";
import { formatNumber } from "@/lib/utils";
import { BurnMetrics } from "@/store/api/tokenomicsApi";

interface BurnMetricsChartProps {
  data: BurnMetrics;
}

export default function BurnMetricsChart({ data }: BurnMetricsChartProps) {
  if (!data || !data.bySource) return null;

  const chartData: RoseChartDataItem[] = [
    { name: "Auctions Burns", value: data.bySource.auctionBurns },
    { name: "DEX Burns", value: data.bySource.dexBurns },
    { name: "Transaction Fees", value: data.bySource.transactionFees },
    { name: "DEX Arbitrage", value: data.bySource.dexArbitrage },
  ];

  const labelFormatter = (params: any) => {
    return `${params.name}  ${formatNumber(params.value)}`;
  };

  return (
    <RoseChart
      data={chartData}
      seriesName="Token Burned by Source"
      labelFormatter={labelFormatter}
    />
  );
}
