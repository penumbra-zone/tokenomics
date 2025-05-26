import dynamic from "next/dynamic";

import { CardContent, CardTitle } from "@/common/components/card";
import CardWrapper from "@/common/components/CardWrapper";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { useGetSupplyMetricsQuery } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const SupplyAllocationChart = dynamic(
  () => import("@/modules/tokenomics/components/charts/SupplyAllocationChart"),
  { ssr: false }
);

export function SupplyAllocationCard() {
  const { data: supply, isLoading } = useGetSupplyMetricsQuery();

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
            />
          )
        )}
      </CardContent>
    </CardWrapper>
  );
}
