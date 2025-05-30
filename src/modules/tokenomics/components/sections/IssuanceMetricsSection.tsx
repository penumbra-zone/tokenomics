import SimpleCard from "@/common/components/cards/SimpleCard";
import { secondaryThemeColors } from "@/common/styles/themeColors";
import ShareButton from "@/modules/tokenomics/components/ShareButton";
import {
  AnnualIssuanceCard,
  CurrentIssuanceCard,
  InflationRateCard,
} from "@/modules/tokenomics/components/cards";
import { PriceHistoryCard } from "@/modules/tokenomics/components/cards/PriceHistoryCard";
import { InflationCard } from "../cards/InflationCard";

interface SectionProps {
  handleShare: () => void;
}

export default function IssuanceMetricsSection({ handleShare }: SectionProps) {
  return (
    <section id="issuance-metrics" className="mb-12 pt-16 -mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">ISSUANCE METRICS</h2>
        <ShareButton onClick={handleShare} />
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
  );
}
