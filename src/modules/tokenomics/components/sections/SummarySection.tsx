import { InflationCard } from "../cards/InflationCard";
import { MarketCapCard } from "../cards/MarketCapCard";
import { PercentOfTotalStakedCard } from "../cards/PercentOfTotalStakedCard";
import { TotalBurnedCard } from "../cards/TotalBurnedCard";
import { TotalSupplyCard } from "../cards/TotalSupplyCard";

interface SectionProps {
  handleShare: () => void;
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
          <InflationCard />
        </div>
        <MarketCapCard />
        <TotalBurnedCard />
      </div>
    </section>
  );
}
