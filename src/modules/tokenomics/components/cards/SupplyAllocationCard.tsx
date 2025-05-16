import dynamic from "next/dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/Card";
import { LoadingOverlay } from "@/common/components/ui/LoadingOverlay";
import { LoadingSpinner } from "@/common/components/ui/LoadingSpinner";
import { useGetSupplyMetricsQuery } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const SupplyAllocationChart = dynamic(
  () => import("@/modules/tokenomics/components/SupplyAllocationChart"),
  { ssr: false }
);

export function SupplyAllocationCard() {
  const { data: supply, isLoading, isFetching } = useGetSupplyMetricsQuery();

  const showLoadingOverlay = isFetching && !supply;

  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Supply Allocation</CardTitle>
        <CardDescription>Genesis vs Issued tokens</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="h-[400px]">
          {isLoading ? (
            <LoadingSpinner className="h-full" />
          ) : (
            supply && (
              <>
                <SupplyAllocationChart
                  data={[
                    { category: "Genesis Allocation", amount: supply.genesisAllocation },
                    { category: "Issued Since Launch", amount: supply.issuedSinceLaunch },
                  ]}
                />
                {showLoadingOverlay && <LoadingOverlay />}
              </>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
