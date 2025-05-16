import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/Card";
import { LoadingOverlay } from "@/common/components/ui/LoadingOverlay";
import { LoadingSpinner } from "@/common/components/ui/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriceHistory } from "@/store/api/tokenomicsApi";
import { useGetPriceHistoryQuery } from "@/store/api/tokenomicsApi";

import { InflationRateCard } from "./InflationRateCard";
import { PriceHistoryCard } from "./PriceHistoryCard";

export function TokenMetricsCard() {
  const [selectedDays, setSelectedDays] = useState(30);
  const { data: priceHistoryData, isLoading, isFetching } = useGetPriceHistoryQuery(selectedDays);

  const handleDaysChange = (days: number) => {
    setSelectedDays(days);
  };

  // Only show loading overlay if we're fetching and don't have enough data
  const showLoadingOverlay = 
    isFetching && (!priceHistoryData || priceHistoryData.length < selectedDays);

  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Token Metrics</CardTitle>
        <CardDescription>Key performance indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="price">Price History</TabsTrigger>
            <TabsTrigger value="inflation">Inflation Rate</TabsTrigger>
          </TabsList>

          {/* Price History Tab */}
          <TabsContent value="price" className="space-y-4">
            <div className="relative">
              {isLoading ? (
                <LoadingSpinner className="h-[400px]" />
              ) : (
                priceHistoryData && (
                  <>
                    <PriceHistoryCard data={priceHistoryData} onDaysChange={handleDaysChange} />
                    {showLoadingOverlay && <LoadingOverlay />}
                  </>
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="inflation" className="space-y-4">
            <div className="relative min-h-[400px] w-full">
              {isLoading ? (
                <LoadingSpinner className="h-[400px]" />
              ) : (
                priceHistoryData && (
                  <>
                    <InflationRateCard data={priceHistoryData} onDaysChange={handleDaysChange} />
                    {showLoadingOverlay && <LoadingOverlay className="min-h-[400px] w-full" />}
                  </>
                )
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
