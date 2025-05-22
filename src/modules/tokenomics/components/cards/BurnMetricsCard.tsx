import dynamic from "next/dynamic";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/Card";
import { LoadingOverlay } from "@/common/components/ui/LoadingOverlay";
import { LoadingSpinner } from "@/common/components/ui/LoadingSpinner";
import CardWrapper from "@/components/ui/CardWrapper";
import { useGetBurnMetricsQuery } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const BurnMetricsChart = dynamic(() => import("@/modules/tokenomics/components/BurnMetricsChart"), {
  ssr: false,
});

export function BurnMetricsCard() {
  const { data: burnMetrics, isLoading, isFetching } = useGetBurnMetricsQuery();

  const showLoadingOverlay = isFetching && !burnMetrics;

  return (
    <CardWrapper className="p-0">
      <CardHeader>
        <CardTitle className="text-primary">Burn Metrics</CardTitle>
        <CardDescription>Token burn rate over time</CardDescription>
      </CardHeader>
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
    </CardWrapper>
  );
}
