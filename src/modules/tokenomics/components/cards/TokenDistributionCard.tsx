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
import { useGetTokenDistributionQuery } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const TokenDistributionChart = dynamic(
  () => import("@/modules/tokenomics/components/TokenDistributionChart"),
  { ssr: false }
);

export function TokenDistributionCard() {
  const { data: distribution, isLoading, isFetching } = useGetTokenDistributionQuery();

  const showLoadingOverlay = isFetching && !distribution;

  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
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
    </Card>
  );
}
