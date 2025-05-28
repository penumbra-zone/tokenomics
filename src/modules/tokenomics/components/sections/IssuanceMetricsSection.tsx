import { useState } from "react";

import { LoadingOverlay } from "@/common/components/LoadingOverlay";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import SimpleCard from "@/common/components/cards/SimpleCard";
import ShareButton from "@/modules/tokenomics/components/ShareButton";
import {
  AnnualIssuanceCard,
  CurrentIssuanceCard,
  InflationRateCard,
  InflationRateCardProps,
} from "@/modules/tokenomics/components/cards";
import {
  PriceHistoryCard,
  PriceHistoryCardProps,
} from "@/modules/tokenomics/components/cards/PriceHistoryCard";
import { useGetPriceHistoryQuery } from "@/store/api/tokenomicsApi";
import { InflationCard } from "../cards/InflationCard";

interface SectionProps {
  handleShare: () => void;
}

const DAY_OPTIONS = [7, 30, 90];
const DEFAULT_DAYS = 30;

export default function IssuanceMetricsSection({ handleShare }: SectionProps) {
  const [currentSelectedDays, setCurrentSelectedDays] = useState<number>(DEFAULT_DAYS);
  const {
    data: priceHistoryData,
    isLoading,
    isFetching,
  } = useGetPriceHistoryQuery(currentSelectedDays);

  const handleDaysChange = (days: number) => {
    setCurrentSelectedDays(days);
  };

  const showLoadingOverlay =
    isFetching && (!priceHistoryData || priceHistoryData.length < currentSelectedDays);

  // Props for PriceHistoryCard - ensuring they match an assumed updated PriceHistoryCardProps
  const priceHistoryCardProps: PriceHistoryCardProps = {
    data: priceHistoryData || [],
    onDaysChange: handleDaysChange,
    currentSelectedDay: currentSelectedDays,
    dayOptions: DAY_OPTIONS,
  };

  // Props for InflationRateCard - ensuring they match an assumed updated InflationRateCardProps
  const inflationRateCardProps: InflationRateCardProps = {
    data: priceHistoryData || [],
    onDaysChange: handleDaysChange,
    currentSelectedDay: currentSelectedDays,
    dayOptions: DAY_OPTIONS,
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
            {isLoading && !priceHistoryData ? (
              <div className="flex-1 flex items-center justify-center min-h-[350px]">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="relative h-full">
                {priceHistoryData && (
                  <>
                    <PriceHistoryCard {...priceHistoryCardProps} />
                    {showLoadingOverlay && <LoadingOverlay />}
                  </>
                )}
              </div>
            )}
          </SimpleCard>
        </div>

        <div className="min-h-[450px]">
          <SimpleCard title="Inflation Rate Over Time">
            {isLoading && !priceHistoryData ? (
              <div className="flex-1 flex items-center justify-center min-h-[350px]">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="relative h-full pt-6">
                {priceHistoryData && (
                  <>
                    <InflationRateCard {...inflationRateCardProps} />
                    {showLoadingOverlay && <LoadingOverlay />}
                  </>
                )}
              </div>
            )}
          </SimpleCard>
        </div>
      </div>
    </section>
  );
}
