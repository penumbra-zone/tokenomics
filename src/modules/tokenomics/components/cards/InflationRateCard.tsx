import dynamic from "next/dynamic";

import CardWrapper from "@/common/components/CardWrapper";
import { PriceHistory } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const InflationRateChart = dynamic(
  () => import("@/modules/tokenomics/components/charts/InflationRateChart"),
  { ssr: false }
);

export interface InflationRateCardProps {
  data: PriceHistory[];
  onDaysChange: (days: number) => void;
  currentSelectedDay: number;
  dayOptions?: number[];
}

export function InflationRateCard({
  data,
  onDaysChange,
  currentSelectedDay,
  dayOptions,
}: InflationRateCardProps) {
  return (
    <CardWrapper>
      <div className="h-[400px]">
        <InflationRateChart
          data={data}
          onDaysChange={onDaysChange}
          currentSelectedDay={currentSelectedDay}
          dayOptions={dayOptions}
        />
      </div>
    </CardWrapper>
  );
}
