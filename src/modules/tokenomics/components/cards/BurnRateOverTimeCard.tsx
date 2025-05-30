"use client";

import CardWrapper from "@/common/components/cards/CardWrapper";
import { LoadingOverlay } from "@/common/components/LoadingOverlay";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BurnRateOverTimeChart } from "@/modules/tokenomics/components/charts/BurnRateOverTimeChart";
import { useGetBurnMetricsQuery } from "@/store/api/tokenomicsApi";
import { useMemo, useState } from "react";

interface BurnRateDataPoint {
  date: string;
  value: number;
}

export function BurnRateOverTimeCard() {
  const [selectedDays, setSelectedDays] = useState(30);
  const { data: burnMetrics, isLoading, isFetching } = useGetBurnMetricsQuery(selectedDays);

  // Transform burn metrics data to chart format
  const chartData = useMemo((): BurnRateDataPoint[] => {
    if (!burnMetrics?.historicalBurnRate) return [];

    return burnMetrics.historicalBurnRate.map((item) => ({
      date: item.timestamp,
      value: item.rate,
    }));
  }, [burnMetrics?.historicalBurnRate]);

  const showLoadingOverlay = isFetching && (!chartData || chartData.length < selectedDays);

  const handleDaysChange = (days: number) => {
    setSelectedDays(days);
  };

  return (
    <CardWrapper className="col-span-1 lg:col-span-2 p-0">
      <CardHeader className="px-6 pt-6 pb-2">
        <CardTitle className="text-lg font-semibold text-white">Burn rate over time</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-6 pb-6">
        {isLoading && !burnMetrics ? (
          <div className="flex items-center justify-center h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="relative h-[400px]">
            <BurnRateOverTimeChart
              data={chartData}
              selectedDay={selectedDays}
              onDaysChange={handleDaysChange}
            />
            {showLoadingOverlay && <LoadingOverlay />}
          </div>
        )}
      </CardContent>
    </CardWrapper>
  );
}
