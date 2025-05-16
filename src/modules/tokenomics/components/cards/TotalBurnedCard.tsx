import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/Card";
import { LoadingOverlay } from "@/common/components/ui/LoadingOverlay";
import { LoadingSpinner } from "@/common/components/ui/LoadingSpinner";
import AnimatedNumber from "@/components/AnimatedNumber";
import { formatNumber } from "@/lib/utils";
import { useGetBurnMetricsQuery } from "@/store/api/tokenomicsApi";

export function TotalBurnedCard() {
  const { data: burnMetrics, isLoading, isFetching } = useGetBurnMetricsQuery();

  const showLoadingOverlay = isFetching && !burnMetrics;

  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-primary text-lg">Total Burned</CardTitle>
        <CardDescription>Tokens removed from supply</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {isLoading ? (
          <LoadingSpinner className="h-[100px]" />
        ) : (
          burnMetrics && (
            <>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedNumber value={burnMetrics.totalBurned} format={(v) => formatNumber(v)} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">
                  Rate: <AnimatedNumber value={burnMetrics.burnRate} format={(v) => `${formatNumber(v, 4)}/block`} />
                </div>
              </div>
              {showLoadingOverlay && <LoadingOverlay />}
            </>
          )
        )}
      </CardContent>
    </Card>
  );
}
