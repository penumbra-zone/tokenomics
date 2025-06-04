import dynamic from "next/dynamic";

import CardWrapper from "@/common/components/cards/CardWrapper";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { useGetTokenDistributionQuery } from "@/store/api/tokenomicsApi";
import { useEffect } from "react";

// Import chart component with SSR disabled
const TokenDistributionChart = dynamic(
  () => import("@/modules/tokenomics/components/charts/TokenDistributionChart"),
  { ssr: false }
);

export interface TokenDistributionCardProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export function TokenDistributionCard({ onLoadingChange }: TokenDistributionCardProps) {
  const { data: distribution, isLoading } = useGetTokenDistributionQuery();

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  return (
    <CardWrapper className="p-6">
      <div className="relative h-[400px]">
        {isLoading ? (
          <LoadingSpinner className="h-full" />
        ) : (
          distribution && (
            <>
              <TokenDistributionChart data={distribution} showAnimation={!onLoadingChange} />
            </>
          )
        )}
      </div>
    </CardWrapper>
  );
}
