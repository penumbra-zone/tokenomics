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
import { useGetSocialMetricsQuery } from "@/store/api/tokenomicsApi";

export function MarketCapCard() {
  const { data: socialMetrics, isLoading, isFetching } = useGetSocialMetricsQuery();

  const showLoadingOverlay = isFetching && !socialMetrics;

  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-primary text-lg">Market Cap</CardTitle>
        <CardDescription>Current valuation</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {isLoading ? (
          <LoadingSpinner className="h-[100px]" />
        ) : (
          socialMetrics && (
            <>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedNumber
                  value={socialMetrics.marketCap}
                  format={(v) => `$${formatNumber(v)}`}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">
                  Price:{" "}
                  <AnimatedNumber
                    value={socialMetrics.price}
                    format={(v) => `$${formatNumber(v, 2)}`}
                  />
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
