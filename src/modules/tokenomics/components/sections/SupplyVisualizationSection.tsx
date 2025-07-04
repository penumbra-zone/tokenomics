import { SECTION_IDS } from "@/lib/types/sections";
import SharePreviewButton from "@/modules/tokenomics/components/SharePreviewButton";
import {
  MarketCapCard,
  SupplyAllocationCard,
  TotalSupplyCard,
} from "@/modules/tokenomics/components/cards";
import SupplyVisualizationSharePreview from "@/modules/tokenomics/components/share/sections/SupplyVisualizationSharePreview";
import { SharePreviewProvider } from "@/modules/tokenomics/context/SharePreviewContext";

export default function SupplyVisualizationSection() {
  return (
    <SharePreviewProvider
      sectionId={SECTION_IDS.SUPPLY_VISUALIZATION}
      SharePreviewComponent={SupplyVisualizationSharePreview}
    >
      <section id="supply-visualization" className="mb-12 pt-16 -mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">SUPPLY VISUALIZATION</h2>
          <SharePreviewButton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-5 gap-6 mb-8">
          {/* Left Column for stacked cards - each card spans 2 rows */}
          <div className="lg:col-span-1 lg:row-span-2">
            <TotalSupplyCard />
          </div>
          <div className="lg:col-span-1 lg:row-start-3 lg:row-span-4">
            <MarketCapCard />
          </div>
          {/* Right Column for the chart - spans 3 columns and 6 rows */}
          <div className="lg:col-span-3 lg:row-span-5">
            <SupplyAllocationCard />
          </div>
        </div>
      </section>
    </SharePreviewProvider>
  );
}
