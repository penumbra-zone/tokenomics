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
import SimpleCard from "@/components/shared/SimpleCard";

// Import chart component with SSR disabled
const BurnMetricsChart = dynamic(() => import("@/modules/tokenomics/components/charts/BurnMetricsChart"), {
  ssr: false,
});

export function BurnMetricsCard() {
  const { data: burnMetrics, isLoading, isFetching } = useGetBurnMetricsQuery();

  const showLoadingOverlay = isFetching && !burnMetrics;

  return (
    <SimpleCard title="Token burn rate over time">
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
