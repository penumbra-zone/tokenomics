import dynamic from "next/dynamic";

import CardWrapper from "@/common/components/cards/CardWrapper";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { CardContent, CardTitle } from "@/components/ui/card";
import { useGetSupplyMetricsQuery } from "@/store/api/tokenomicsApi";
import { useEffect } from "react";

// Import chart component with SSR disabled
const SupplyAllocationChart = dynamic(
  () => import("@/modules/tokenomics/components/charts/SupplyAllocationChart"),
  { ssr: false }
);

export interface SupplyAllocationCardProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export function SupplyAllocationCard({ onLoadingChange }: SupplyAllocationCardProps) {
  const { data: supply, isLoading } = useGetSupplyMetricsQuery();

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  return (
    <CardWrapper className="min-h-[344px] h-full">
      <CardTitle className="text-base font-medium text-neutral-50 mb-4">
        Genesis allocation vs. Issuance since launch
      </CardTitle>
      <CardContent className="relative flex-grow flex items-center justify-center p-0 h-full">
        {isLoading ? (
          <LoadingSpinner className="h-20 w-20" />
        ) : (
          supply && (
            <SupplyAllocationChart
              data={[
                { category: "Genesis Allocation", amount: supply.genesisAllocation },
                { category: "Issued Since Launch", amount: supply.issuedSinceLaunch },
              ]}
              showAnimation={!onLoadingChange}
            />
          )
        )}
      </CardContent>
    </CardWrapper>
  );
}
