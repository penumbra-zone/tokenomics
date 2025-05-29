"use client";
import dynamic from "next/dynamic";

import InfoCard from "@/common/components/cards/InfoCard";
import { LoadingOverlay } from "@/common/components/LoadingOverlay";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { useGetPriceHistoryQuery } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const PriceHistoryChart = dynamic(
  () => import("@/modules/tokenomics/components/charts/PriceHistoryChart"),
  { ssr: false }
);

export interface PriceHistoryCardProps {
  onDaysChange: (days: number) => void;
  dayOptions?: number[];
  currentSelectedDay: number;
}

export function PriceHistoryCard({
  onDaysChange,
  currentSelectedDay,
  dayOptions,
}: PriceHistoryCardProps) {
  const {
    data: priceHistoryData,
    isLoading,
    isFetching,
  } = useGetPriceHistoryQuery(currentSelectedDay);

  const showLoadingOverlay = isFetching && !priceHistoryData;

  if (isLoading && !priceHistoryData) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <PriceHistoryChart
          onDaysChange={onDaysChange}
          currentSelectedDay={currentSelectedDay}
          dayOptions={dayOptions}
        />
        {showLoadingOverlay && <LoadingOverlay />}
      </div>
      {/* Metrics grid below chart */}
      {priceHistoryData && priceHistoryData.priceHistory.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {/* Current Price */}
          <InfoCard
            title="Current Price"
            isLoading={false}
            value={priceHistoryData.priceHistory[priceHistoryData.priceHistory.length - 1].price}
            valuePrefix="$"
          />
          {/* All-Time High */}
          <InfoCard
            title="All-Time High"
            isLoading={false}
            value={priceHistoryData.allTimeHigh}
            valuePrefix="$"
          />
          {/* All-Time Low */}
          <InfoCard
            title="All-Time Low"
            isLoading={false}
            value={priceHistoryData.allTimeLow.toFixed(4)}
            valuePrefix="$"
          />
        </div>
      )}
    </>
  );
}
