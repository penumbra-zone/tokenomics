import dynamic from "next/dynamic";

import CardWrapper from "@/common/components/cards/CardWrapper";

// Import chart component with SSR disabled
const InflationRateChart = dynamic(
  () => import("@/modules/tokenomics/components/charts/InflationRateChart"),
  { ssr: false }
);

export interface InflationRateCardProps {
  onDaysChange: (days: number) => void;
  currentSelectedDay: number;
  dayOptions?: number[];
}

export function InflationRateCard({
  onDaysChange,
  currentSelectedDay,
  dayOptions,
}: InflationRateCardProps) {
  return (
    <CardWrapper>
      <div className="h-[400px]">
        <InflationRateChart
          onDaysChange={onDaysChange}
          currentSelectedDay={currentSelectedDay}
          dayOptions={dayOptions}
        />
      </div>
    </CardWrapper>
  );
}
