import dynamic from "next/dynamic";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/Card";
import CardWrapper from "@/components/ui/CardWrapper";
import { PriceHistory } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const InflationRateChart = dynamic(
  () => import("@/modules/tokenomics/components/InflationRateChart"),
  { ssr: false }
);

interface InflationRateCardProps {
  data: PriceHistory[];
  onDaysChange?: (days: number) => void;
}

export function InflationRateCard({ data, onDaysChange }: InflationRateCardProps) {
  return (
    <CardWrapper className="p-0">
      <CardHeader>
        <CardTitle className="text-primary">Inflation Rate</CardTitle>
        <CardDescription>Token inflation over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <InflationRateChart data={data} onDaysChange={onDaysChange} />
        </div>
      </CardContent>
    </CardWrapper>
  );
}
