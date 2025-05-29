import { useState } from "react";

import SimpleCard from "@/common/components/cards/SimpleCard";
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

const DAY_OPTIONS = [7, 30, 90];
const DEFAULT_DAYS = 30;

export default function IssuanceMetricsSection({ handleShare }: SectionProps) {
  const [currentSelectedDays, setCurrentSelectedDays] = useState<number>(DEFAULT_DAYS);

  const handleDaysChange = (days: number) => {
    setCurrentSelectedDays(days);
  };

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
          <InflationCard />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8">
        <div className="min-h-[450px]">
          <SimpleCard title="Price history" titleClassName="mb-6">
            <PriceHistoryCard
              onDaysChange={handleDaysChange}
              currentSelectedDay={currentSelectedDays}
              dayOptions={DAY_OPTIONS}
            />
          </SimpleCard>
        </div>

        <div className="min-h-[450px]">
          <SimpleCard title="Inflation Rate Over Time">
            <div className="pt-6">
              <InflationRateCard
                onDaysChange={handleDaysChange}
                currentSelectedDay={currentSelectedDays}
                dayOptions={DAY_OPTIONS}
              />
            </div>
          </SimpleCard>
        </div>
      </div>
    </section>
  );
}
