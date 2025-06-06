import SimpleCard from "@/common/components/cards/SimpleCard";
import { secondaryThemeColors } from "@/common/styles/themeColors";
import { SECTION_IDS } from "@/lib/types/sections";
import SharePreviewButton from "@/modules/tokenomics/components/SharePreviewButton";
import {
  AnnualIssuanceCard,
  CurrentIssuanceCard,
  InflationRateCard,
} from "@/modules/tokenomics/components/cards";
import { PriceHistoryCard } from "@/modules/tokenomics/components/cards/PriceHistoryCard";
import IssuanceMetricsSharePreview from "@/modules/tokenomics/components/share/sections/IssuanceMetricsSharePreview";
import { SharePreviewProvider } from "@/modules/tokenomics/context/SharePreviewContext";
import { InflationCard } from "../cards/InflationCard";

export default function IssuanceMetricsSection() {
  return (
    <SharePreviewProvider
      sectionId={SECTION_IDS.ISSUANCE_METRICS}
      SharePreviewComponent={IssuanceMetricsSharePreview}
    >
      <section id="issuance-metrics" className="mb-12 pt-16 -mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">ISSUANCE METRICS</h2>
          <SharePreviewButton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="min-h-[100px]">
            <CurrentIssuanceCard />
          </div>
          <div className="min-h-[100px]">
            <AnnualIssuanceCard />
          </div>
          <div className="min-h-[100px]">
            <InflationCard themeColors={secondaryThemeColors} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8">
          <div className="min-h-[450px]">
            <SimpleCard title="Price history" titleClassName="mb-6">
              <PriceHistoryCard />
            </SimpleCard>
          </div>

          <div className="min-h-[450px]">
            <SimpleCard title="Inflation Rate Over Time">
              <div className="pt-6">
                <InflationRateCard />
              </div>
            </SimpleCard>
          </div>
        </div>
      </section>
    </SharePreviewProvider>
  );
}
