import CardWrapper from "@/common/components/cards/CardWrapper";
import { LoadingOverlay } from "@/common/components/LoadingOverlay";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { useGetLQTMetricsQuery } from "@/store/api/tokenomicsApi";

export function LQTMetricsCard() {
  const { data: lqtMetrics, isLoading, isFetching } = useGetLQTMetricsQuery();

  const showLoadingOverlay = isFetching && !lqtMetrics;

  return (
    <CardWrapper className="p-0">
      <CardHeader>
        <CardTitle className="text-primary">Liquidity Tournament Metrics</CardTitle>
        <CardDescription>LQT rewards and voting power</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {isLoading ? (
          <LoadingSpinner className="h-[200px]" />
        ) : (
          lqtMetrics && (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Rewards</p>
                    <p className="text-xl font-bold text-foreground">
                      {formatNumber(lqtMetrics.availableRewards)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Voting Power</p>
                    <p className="text-xl font-bold text-foreground">
                      {formatNumber(lqtMetrics.votingPower.total)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Delegator Rewards</p>
                    <p className="text-xl font-bold text-foreground">
                      {formatNumber(lqtMetrics.delegatorRewards)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LP Rewards</p>
                    <p className="text-xl font-bold text-foreground">
                      {formatNumber(lqtMetrics.lpRewards)}
                    </p>
                  </div>
                </div>
              </div>
              {showLoadingOverlay && <LoadingOverlay />}
            </>
          )
        )}
      </CardContent>
    </CardWrapper>
  );
}
