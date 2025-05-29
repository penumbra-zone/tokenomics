"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

import InfoCard from "@/common/components/cards/InfoCard";
import { useGetPriceHistoryQuery } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const PriceHistoryChart = dynamic(
  () => import("@/modules/tokenomics/components/charts/PriceHistoryChart"),
  { ssr: false }
);

const DAY_OPTIONS = [7, 30, 90];
const DEFAULT_DAYS = 30;

export interface PriceHistoryCardProps {
  // Remove external props since we're managing state internally now
  dayOptions?: number[];
}

export function PriceHistoryCard({ dayOptions = DAY_OPTIONS }: PriceHistoryCardProps) {
  // Internal state management for days selection
  const [currentSelectedDay, setCurrentSelectedDay] = useState<number>(DEFAULT_DAYS);

  const handleDaysChange = (days: number) => {
    setCurrentSelectedDay(days);
  };

  const {
    data: priceHistoryData,
    isLoading,
    isFetching,
  } = useGetPriceHistoryQuery(currentSelectedDay);

  return (
    <>
      <div className="relative h-[450px]">
        <PriceHistoryChart
          onDaysChange={handleDaysChange}
          currentSelectedDay={currentSelectedDay}
          dayOptions={dayOptions}
        />
      </div>
      {/* Metrics grid below chart */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {/* Current Price */}
        <InfoCard
          title="Current Price"
          isLoading={isLoading}
          value={priceHistoryData?.priceHistory[priceHistoryData.priceHistory.length - 1].price}
          valuePrefix="$"
        />
        {/* All-Time High */}
        <InfoCard
          title="All-Time High"
          isLoading={isLoading}
          value={priceHistoryData?.allTimeHigh}
          valuePrefix="$"
        />
        {/* All-Time Low */}
        <InfoCard
          title="All-Time Low"
          isLoading={isLoading}
          value={priceHistoryData?.allTimeLow.toFixed(4)}
          valuePrefix="$"
        />
      </div>
    </>
  );
}
