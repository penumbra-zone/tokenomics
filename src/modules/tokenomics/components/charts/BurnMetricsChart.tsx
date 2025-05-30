import RoseChart, { RoseChartDataItem } from "@/common/components/charts/RoseChart";
import { formatNumber } from "@/lib/utils";
import { BurnMetrics } from "@/store/api/tokenomicsApi";

interface BurnMetricsChartProps {
  data: BurnMetrics;
}

export default function BurnMetricsChart({ data }: BurnMetricsChartProps) {
  if (!data || !data.bySource) return null;

  const chartData: RoseChartDataItem[] = [
    { name: "Auctions Locks", value: data.bySource.auctionLocked },
    { name: "DEX Locks", value: data.bySource.dexLocked },
    { name: "Transaction Fees", value: data.bySource.feeBurns },
    { name: "Arbitrage Burns", value: data.bySource.arbitrageBurns },
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
