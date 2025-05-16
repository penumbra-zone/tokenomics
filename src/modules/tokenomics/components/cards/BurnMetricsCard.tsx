import dynamic from "next/dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/Card";
import { LoadingSpinner } from "@/common/components/ui/LoadingSpinner";
import { BurnMetrics } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const BurnMetricsChart = dynamic(() => import("@/modules/tokenomics/components/BurnMetricsChart"), {
  ssr: false,
});

interface BurnMetricsCardProps {
  data: BurnMetrics;
  isLoading?: boolean;
}

export function BurnMetricsCard({ data, isLoading }: BurnMetricsCardProps) {
  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Burn Metrics</CardTitle>
        <CardDescription>Token burn rate over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {isLoading ? <LoadingSpinner className="h-full" /> : <BurnMetricsChart data={data} />}
        </div>
      </CardContent>
    </Card>
  );
}
