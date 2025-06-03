import { InflationCard } from "../cards/InflationCard";
import { MarketCapCard } from "../cards/MarketCapCard";
import { PercentStakedOfTotalSupplyCard } from "../cards/PercentStakedOfTotalSupplyCard";
import { TotalBurnedCard } from "../cards/TotalBurnedCard";
import { TotalSupplyCard } from "../cards/TotalSupplyCard";

export default function SummarySection() {
  return (
    <section id="summary" className="mb-12 pt-16 -mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">SUMMARY</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <TotalSupplyCard />
        <PercentStakedOfTotalSupplyCard />
        <div className="lg:row-span-2">
          <InflationCard />
        </div>
        <MarketCapCard />
        <TotalBurnedCard />
      </div>
    </section>
  );
}
