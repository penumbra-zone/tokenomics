"use client";
import dynamic from "next/dynamic";

import InfoCard from "@/common/components/InfoCard";
import { PriceHistory } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const PriceHistoryChart = dynamic(
  () => import("@/modules/tokenomics/components/charts/PriceHistoryChart"),
  { ssr: false }
);

export interface PriceHistoryCardProps {
  data: PriceHistory[];
  onDaysChange: (days: number) => void;
  dayOptions?: number[];
  currentSelectedDay: number;
}

export function PriceHistoryCard({
  data,
  onDaysChange,
  currentSelectedDay,
  dayOptions,
}: PriceHistoryCardProps) {
  return (
    <>
      <PriceHistoryChart
        data={data}
        onDaysChange={onDaysChange}
        currentSelectedDay={currentSelectedDay}
        dayOptions={dayOptions}
      />
      {/* Metrics grid below chart */}
      {data && data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {/* Current Price */}
          <InfoCard
            title="Current Price"
            isLoading={false}
            value={data[data.length - 1].price}
            valuePrefix="$"
          />
          {/* All-Time High */}
          <InfoCard
            title="All-Time High"
            isLoading={false}
            value={Math.max(...data.map((p) => p.price))}
            valuePrefix="$"
          />
          {/* All-Time Low */}
          <InfoCard
            title="All-Time Low"
            isLoading={false}
            value={Math.min(...data.map((p) => p.price))}
            valuePrefix="$"
          />
        </div>
      )}
    </>
  );
}
