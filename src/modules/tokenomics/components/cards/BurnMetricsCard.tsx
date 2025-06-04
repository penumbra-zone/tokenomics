import dynamic from "next/dynamic";
import { useEffect } from "react";

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

export interface BurnMetricsCardProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export function BurnMetricsCard({ onLoadingChange }: BurnMetricsCardProps) {
  const { data: burnMetrics, isLoading, isFetching } = useGetBurnMetricsQuery(30);

  useEffect(() => {
    onLoadingChange?.(isLoading || isFetching);
  }, [isLoading, isFetching, onLoadingChange]);

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
                <BurnMetricsChart data={burnMetrics} showAnimation={!onLoadingChange} />
                {showLoadingOverlay && <LoadingOverlay />}
              </>
            )
          )}
        </div>
      </CardContent>
    </SimpleCard>
  );
}
