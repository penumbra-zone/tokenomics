import InfoCard from "@/common/components/cards/InfoCard";
import {
  MarketCapCard,
  PercentOfTotalStakedCard,
  TotalBurnedCard,
  TotalSupplyCard,
} from "@/modules/tokenomics/components/cards";
import { useGetSocialMetricsQuery } from "@/store/api/tokenomicsApi";

interface SectionProps {
  handleShare: () => void;
}

// Custom inflation card without chart for summary
function InflationSummaryCard() {
  const { data: socialMetrics, isLoading } = useGetSocialMetricsQuery();

  return (
    <InfoCard
      title="Inflation"
      isLoading={isLoading}
      value={socialMetrics?.inflationRate}
      valueFormatter={(v) => `${v?.toFixed(1)}%`}
      description="during last month"
      cardClassName="h-full"
    />
  );
}

export default function SummarySection({ handleShare }: SectionProps) {
  return (
    <section id="summary" className="mb-12 pt-16 -mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">SUMMARY</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <TotalSupplyCard />
        <PercentOfTotalStakedCard />
        <div className="lg:row-span-2">
          <InflationSummaryCard />
        </div>
        <MarketCapCard />
        <TotalBurnedCard />
      </div>
    </section>
  );
}
