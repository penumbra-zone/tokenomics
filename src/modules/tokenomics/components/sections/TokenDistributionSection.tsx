import { secondaryThemeColors } from "@/common/styles/themeColors";
import { SECTION_IDS } from "@/lib/types/sections";
import SharePreviewButton from "@/modules/tokenomics/components/SharePreviewButton";
import {
  CirculatingSupplyCard,
  PercentStakedOfTotalSupplyCard,
  TokenDistributionCard,
} from "@/modules/tokenomics/components/cards";
import TokenDistributionSharePreview from "@/modules/tokenomics/components/share/sections/TokenDistributionSharePreview";
import { SharePreviewProvider } from "@/modules/tokenomics/context/SharePreviewContext";

export default function TokenDistributionSection() {
  return (
    <SharePreviewProvider
      sectionId={SECTION_IDS.TOKEN_DISTRIBUTION}
      SharePreviewComponent={TokenDistributionSharePreview}
    >
      <section id="token-distribution" className="mb-12 pt-16 -mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">TOKEN DISTRIBUTION</h2>
          <SharePreviewButton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left column with info cards */}
          <div className="lg:col-span-1 space-y-1">
            <div className="flex flex-col gap-4">
              <CirculatingSupplyCard />
              <PercentStakedOfTotalSupplyCard themeColors={secondaryThemeColors} />
            </div>
          </div>
          {/* Right column with token distribution chart */}
          <div className="lg:col-span-2">
            <TokenDistributionCard />
          </div>
        </div>
      </section>
    </SharePreviewProvider>
  );
}
