import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/common/components/ui/Card";
import dynamic from "next/dynamic";
import { PriceHistory } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const InflationRateChart = dynamic(
  () => import("@/modules/tokenomics/components/InflationRateChart"),
  { ssr: false }
);

interface InflationRateCardProps {
  data: PriceHistory[];
}

export function InflationRateCard({ data }: InflationRateCardProps) {
  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Inflation Rate</CardTitle>
        <CardDescription>Token inflation over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <InflationRateChart data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
