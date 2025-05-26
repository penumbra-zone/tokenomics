"use client";

import { Button } from "@/common/components/button";
import { CardContent, CardHeader, CardTitle } from "@/common/components/card";
import CardWrapper from "@/common/components/CardWrapper";
import { BurnRateOverTimeChart } from "@/modules/tokenomics/components/charts/BurnRateOverTimeChart";
import { useState } from "react";

export type TimeRange = "7d" | "30d" | "90d";

// Mock data - in a real app, this would come from props or an API
const mockChartData = {
  "7d": Array.from({ length: 7 }, (_, i) => ({
    date: `2024-09-${String(i + 1).padStart(2, "0")}`,
    value: Math.random() * 100,
  })),
  "30d": Array.from({ length: 30 }, (_, i) => ({
    date: `2024-08-${String(i + 1).padStart(2, "0")}`,
    value: Math.random() * 100,
  })),
  "90d": Array.from({ length: 90 }, (_, i) => ({
    date: `2024-07-${String(i + 1).padStart(2, "0")}`,
    value: Math.random() * 100,
  })),
};

export function BurnRateOverTimeCard() {
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange>("7d");

  const handleTimeRangeChange = (range: TimeRange) => {
    setActiveTimeRange(range);
  };

  const timeRanges: { label: string; value: TimeRange }[] = [
    { label: "7d", value: "7d" },
    { label: "30d", value: "30d" },
    { label: "90d", value: "90d" },
  ];

  return (
    <CardWrapper className="col-span-1 lg:col-span-2 p-0">
      <CardHeader className="px-6 pt-6 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-white">Burn rate over time</CardTitle>
          <div className="flex space-x-1 bg-neutral-800 p-0.5 rounded-md">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant="ghost"
                size="sm"
                onClick={() => handleTimeRangeChange(range.value)}
                className={`
                  px-3 py-1 text-xs rounded-md
                  ${
                    activeTimeRange === range.value
                      ? "bg-primary text-white"
                      : "text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200"
                  }
                `}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-6 pb-6">
        <BurnRateOverTimeChart
          // data={mockChartData[activeTimeRange]} // This will be passed if chart expects data directly
          timeRange={activeTimeRange}
        />
      </CardContent>
    </CardWrapper>
  );
}
