"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

import CardWrapper from "@/common/components/cards/CardWrapper";

// Import chart component with SSR disabled
const InflationRateChart = dynamic(
  () => import("@/modules/tokenomics/components/charts/InflationRateChart"),
  { ssr: false }
);

const DAY_OPTIONS = [7, 30, 90];
const DEFAULT_DAYS = 30;

export interface InflationRateCardProps {
  // Remove the external props since we're managing state internally now
  dayOptions?: number[];
}

export function InflationRateCard({ dayOptions = DAY_OPTIONS }: InflationRateCardProps) {
  // Internal state management for days selection
  const [currentSelectedDay, setCurrentSelectedDay] = useState<number>(DEFAULT_DAYS);

  const handleDaysChange = (days: number) => {
    setCurrentSelectedDay(days);
  };

  return (
    <CardWrapper>
      <div className="h-[400px]">
        <InflationRateChart
          onDaysChange={handleDaysChange}
          currentSelectedDay={currentSelectedDay}
          dayOptions={dayOptions}
        />
      </div>
    </CardWrapper>
  );
}
