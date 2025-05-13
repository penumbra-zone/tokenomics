import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/common/components/ui/Card";
import dynamic from "next/dynamic";
import { BurnMetrics } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const BurnMetricsChart = dynamic(
  () => import("@/modules/tokenomics/components/BurnMetricsChart"),
  { ssr: false }
);

interface BurnMetricsCardProps {
  data: BurnMetrics;
}

export function BurnMetricsCard({ data }: BurnMetricsCardProps) {
  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Burn Metrics</CardTitle>
        <CardDescription>Token burn by source</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <BurnMetricsChart data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
