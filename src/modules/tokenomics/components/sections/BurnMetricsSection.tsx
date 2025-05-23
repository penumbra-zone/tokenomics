import { Share2 } from "lucide-react";

import ShareButton from "@/modules/tokenomics/components/ShareButton";
import {
  BurnMetricsCard,
  TotalBurnedCard,
  PercentOfTotalSupplyCard,
  WhyBurningIsImportantCard,
  BurnRateOverTimeCard
} from "@/modules/tokenomics/components/cards";

interface SectionProps {
  handleShare: () => void;
}

export default function BurnMetricsSection({ handleShare }: SectionProps) {
  return (
    <section className="mb-12 pt-16 -mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">BURN METRICS</h2>
        <ShareButton onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </ShareButton>
      </div>

      {/* Top Row: Token Burned by Source (Pie Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <BurnMetricsCard /> {/* This card already contains the pie chart */}
      </div>

      {/* Middle Row: Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="col-span-1">
          <TotalBurnedCard />
        </div>
        <div className="col-span-1">
          <PercentOfTotalSupplyCard />
        </div>
        <div className="col-span-2">
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
