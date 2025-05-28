import dynamic from "next/dynamic";

import { LoadingOverlay } from "@/common/components/LoadingOverlay";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import SimpleCard from "@/common/components/cards/SimpleCard";
import { CardContent } from "@/components/ui/card";
import { useGetBurnMetricsQuery } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const BurnMetricsChart = dynamic(
  () => import("@/modules/tokenomics/components/charts/BurnMetricsChart"),
  {
    ssr: false,
  }
);

export function BurnMetricsCard() {
  const { data: burnMetrics, isLoading, isFetching } = useGetBurnMetricsQuery();

  const showLoadingOverlay = isFetching && !burnMetrics;

  return (
    <SimpleCard title="Token burned by source">
      <CardContent className="relative">
        <div className="h-[400px]">
          {isLoading ? (
            <LoadingSpinner className="h-full" />
          ) : (
            burnMetrics && (
              <>
                <BurnMetricsChart data={burnMetrics} />
                {showLoadingOverlay && <LoadingOverlay />}
              </>
            )
          )}
        </div>
      </CardContent>
    </SimpleCard>
  );
}
