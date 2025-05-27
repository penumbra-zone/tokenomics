import ShareButton from "@/modules/tokenomics/components/ShareButton";
import {
  BurnMetricsCard,
  BurnRateOverTimeCard,
  PercentOfTotalSupplyCard,
  TotalBurnedCard,
  WhyBurningIsImportantCard,
} from "@/modules/tokenomics/components/cards";

interface SectionProps {
  handleShare: () => void;
}

export default function BurnMetricsSection({ handleShare }: SectionProps) {
  return (
    <section id="burn-metrics" className="mb-12 pt-16 -mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">BURN METRICS</h2>
        <ShareButton onClick={handleShare} />
      </div>

      {/* Top Row: Token Burned by Source (Pie Chart) */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <BurnMetricsCard /> {/* This card already contains the pie chart */}
      </div>

      {/* Middle Row: Stats Cards - Better mobile layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-1">
          <TotalBurnedCard />
        </div>
        <div className="col-span-1">
          <PercentOfTotalSupplyCard />
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <WhyBurningIsImportantCard />
        </div>
      </div>

      {/* Bottom Row: Burn Rate Over Time Chart */}
      <div className="grid grid-cols-1 gap-6">
        <BurnRateOverTimeCard />
      </div>
    </section>
  );
}
