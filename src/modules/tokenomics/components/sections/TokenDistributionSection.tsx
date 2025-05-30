import { secondaryThemeColors } from "@/common/styles/themeColors";
import ShareButton from "@/modules/tokenomics/components/ShareButton";
import {
  CirculatingSupplyCard,
  PercentStakedOfTotalSupplyCard,
  TokenDistributionCard,
} from "@/modules/tokenomics/components/cards";

interface SectionProps {
  handleShare: () => void;
}

export default function TokenDistributionSection({ handleShare }: SectionProps) {
  return (
    <section id="token-distribution" className="mb-12 pt-16 -mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">TOKEN DISTRIBUTION</h2>
        <ShareButton onClick={handleShare} />
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
  );
}
