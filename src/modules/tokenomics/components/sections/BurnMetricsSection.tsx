import { SECTION_IDS } from "@/lib/types/sections";
import SharePreviewButton from "@/modules/tokenomics/components/SharePreviewButton";
import {
  BurnMetricsCard,
  BurnRateOverTimeCard,
  PercentBurnedOfTotalSupplyCard,
  TotalBurnedCard,
  WhyBurningIsImportantCard,
} from "@/modules/tokenomics/components/cards";
import BurnMetricsSharePreview from "@/modules/tokenomics/components/share/sections/BurnMetricsSharePreview";
import { SharePreviewProvider } from "@/modules/tokenomics/context/SharePreviewContext";

export default function BurnMetricsSection() {
  return (
    <SharePreviewProvider
      sectionId={SECTION_IDS.BURN_METRICS}
      SharePreviewComponent={BurnMetricsSharePreview}
    >
      <section id="burn-metrics" className="mb-12 pt-16 -mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">BURN METRICS</h2>
          <SharePreviewButton />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <BurnMetricsCard />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="col-span-1">
            <TotalBurnedCard />
          </div>
          <div className="col-span-1">
            <PercentBurnedOfTotalSupplyCard />
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
    </SharePreviewProvider>
  );
}
