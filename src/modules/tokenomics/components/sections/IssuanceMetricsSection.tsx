import { Share2 } from "lucide-react";
import { useState } from "react";

import InfoCard from "@/common/components/InfoCard";
import { LoadingOverlay } from "@/common/components/LoadingOverlay";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import SimpleCard from "@/common/components/SimpleCard";
import ShareButton from "@/modules/tokenomics/components/ShareButton";
import {
  InflationRateCard,
  InflationRateCardProps,
} from "@/modules/tokenomics/components/cards/InflationRateCard";
import {
  PriceHistoryCard,
  PriceHistoryCardProps,
} from "@/modules/tokenomics/components/cards/PriceHistoryCard";
import { useGetPriceHistoryQuery } from "@/store/api/tokenomicsApi";

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
    <section className="mb-12 pt-16 -mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">ISSUANCE METRICS</h2>
        <ShareButton onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </ShareButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="min-h-[100px]">
          <InfoCard
            title="Current Issuance"
            isLoading={false}
            value="0.05M"
            valueClassName="text-3xl font-bold"
          />
        </div>
        <div className="min-h-[100px]">
          <InfoCard
            title="Annual Issuance"
            isLoading={false}
            value="~1.0M"
            valueClassName="text-3xl font-bold"
            description="TOKEN/year"
          />
        </div>
        <div className="min-h-[100px]">
          <InfoCard
            title="Inflation"
            isLoading={false}
            value="3.5%"
            valueClassName="text-3xl font-bold"
            description="during last month"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8">
        <div className="min-h-[450px]">
          <SimpleCard title="Price history" titleClassName="mb-6">
            <div className="relative h-full">
              {isLoading && !priceHistoryData ? (
                <LoadingSpinner className="absolute inset-0 m-auto" />
              ) : (
                priceHistoryData && (
                  <>
                    <PriceHistoryCard {...priceHistoryCardProps} />
                    {showLoadingOverlay && <LoadingOverlay />}
                  </>
                )
              )}
            </div>
          </SimpleCard>
        </div>

        <div className="min-h-[450px]">
          <SimpleCard title="Inflation Rate Over Time">
            <div className="relative h-full pt-6">
              {isLoading && !priceHistoryData ? (
                <LoadingSpinner className="absolute inset-0 m-auto" />
              ) : (
                priceHistoryData && (
                  <>
                    <InflationRateCard {...inflationRateCardProps} />
                    {showLoadingOverlay && <LoadingOverlay />}
                  </>
                )
              )}
            </div>
          </SimpleCard>
        </div>
      </div>
    </section>
  );
}
