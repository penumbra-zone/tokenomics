import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriceHistory } from "@/store/api/tokenomicsApi";

import { InflationRateCard } from "./InflationRateCard";
import { PriceHistoryCard } from "./PriceHistoryCard";

interface TokenMetricsCardProps {
  priceHistoryData: PriceHistory[];
  inflationRateData: PriceHistory[];
}

export function TokenMetricsCard({ priceHistoryData, inflationRateData }: TokenMetricsCardProps) {
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
            <PriceHistoryCard data={priceHistoryData} />
          </TabsContent>

          <TabsContent value="inflation" className="space-y-4">
            <InflationRateCard data={inflationRateData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
