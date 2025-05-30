"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

import { HintCard } from "@/common/components/cards/HintCard";
import { secondaryThemeColors } from "@/common/styles/themeColors";

// Import chart component with SSR disabled
const InflationRateChart = dynamic(
  () => import("@/modules/tokenomics/components/charts/InflationRateChart"),
  { ssr: false }
);

const DAY_OPTIONS = [7, 30, 90];
const DEFAULT_DAYS = 30;

export interface InflationRateCardProps {
  dayOptions?: number[];
}

export function InflationRateCard({ dayOptions = DAY_OPTIONS }: InflationRateCardProps) {
  // Internal state management for days selection
  const [currentSelectedDay, setCurrentSelectedDay] = useState<number>(DEFAULT_DAYS);

  const handleDaysChange = (days: number) => {
    setCurrentSelectedDay(days);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 min-h-[450px]">
        <InflationRateChart
          onDaysChange={handleDaysChange}
          currentSelectedDay={currentSelectedDay}
          dayOptions={dayOptions}
          themeColors={secondaryThemeColors}
        />
      </div>

      <HintCard
        title="Why is inflation going down?"
        description="Each block issues the same number of tokens, but the total supply keeps increasing. That means new tokens represent a smaller share of the total, and inflation naturally decreases over time."
      />
    </div>
  );
}
