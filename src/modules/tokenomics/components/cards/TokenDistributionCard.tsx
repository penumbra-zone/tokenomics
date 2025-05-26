import dynamic from "next/dynamic";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/common/components/card";
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
    <CardWrapper className="p-0">
      <CardHeader>
        <CardTitle className="text-primary">Token Distribution</CardTitle>
        <CardDescription>Allocation of total token supply</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="h-[400px]">
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
      </CardContent>
    </CardWrapper>
  );
}
