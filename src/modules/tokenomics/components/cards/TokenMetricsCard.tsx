import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/common/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PriceHistoryCard } from "./PriceHistoryCard";
import { InflationRateCard } from "./InflationRateCard";
import { PriceHistory } from "@/store/api/tokenomicsApi";

interface TokenMetricsCardProps {
  priceHistoryData: PriceHistory[];
  inflationRateData: PriceHistory[];
}

export function TokenMetricsCard({
  priceHistoryData,
  inflationRateData,
}: TokenMetricsCardProps) {
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
