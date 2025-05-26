"use client";

import { CardContent, CardHeader, CardTitle } from "@/common/components/card";
import CardWrapper from "@/common/components/CardWrapper";
import { LoadingOverlay } from "@/common/components/LoadingOverlay";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { BurnRateOverTimeChart } from "@/modules/tokenomics/components/charts/BurnRateOverTimeChart";
import { useGetBurnMetricsQuery } from "@/store/api/tokenomicsApi";
import { useState } from "react";

interface BurnRateDataPoint {
  date: string;
  value: number;
}

export function BurnRateOverTimeCard() {
  const [selectedDays, setSelectedDays] = useState(30);
  const { data: burnMetrics, isLoading, isFetching } = useGetBurnMetricsQuery();

  // Transform burn metrics data to chart format
  const transformBurnMetricsToChartData = (): BurnRateDataPoint[] => {
    if (!burnMetrics?.historicalBurnRate) return [];

    return burnMetrics.historicalBurnRate.map((item) => ({
      date: item.timestamp,
      value: item.rate,
    }));
  };

  const data = transformBurnMetricsToChartData();
  const showLoadingOverlay = isFetching && (!data || data.length < selectedDays);

  const handleDaysChange = (days: number) => {
    setSelectedDays(days);
  };

  return (
    <CardWrapper className="col-span-1 lg:col-span-2 p-0">
      <CardHeader className="px-6 pt-6 pb-2">
        <CardTitle className="text-lg font-semibold text-white">Burn rate over time</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-6 pb-6">
        <div className="relative h-[400px]">
          {isLoading && !data ? (
            <LoadingSpinner className="absolute inset-0 m-auto" />
          ) : (
            data &&
            data.length > 0 && (
              <>
                <BurnRateOverTimeChart
                  data={data}
                  selectedDay={selectedDays}
                  onDaysChange={handleDaysChange}
                />
                {showLoadingOverlay && <LoadingOverlay />}
              </>
            )
          )}
        </div>
      </CardContent>
    </CardWrapper>
  );
}
