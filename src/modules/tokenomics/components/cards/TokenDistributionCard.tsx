import dynamic from "next/dynamic";

import CardWrapper from "@/common/components/CardWrapper";
import { LoadingOverlay } from "@/common/components/LoadingOverlay";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { useGetTokenDistributionQuery } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const TokenDistributionChart = dynamic(
  () => import("@/modules/tokenomics/components/charts/TokenDistributionChart"),
  { ssr: false }
);

export function TokenDistributionCard() {
  const { data: distribution, isLoading, isFetching } = useGetTokenDistributionQuery();

  const showLoadingOverlay = isFetching && !distribution;

  return (
    <CardWrapper className="p-6">
      <div className="relative h-[400px]">
        {isLoading ? (
          <LoadingSpinner className="h-full" />
        ) : (
          distribution && (
            <>
              <TokenDistributionChart data={distribution} />
              {showLoadingOverlay && <LoadingOverlay />}
            </>
          )
        )}
      </div>
    </CardWrapper>
  );
}
