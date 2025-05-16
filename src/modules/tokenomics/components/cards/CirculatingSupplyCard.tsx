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
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/utils";
import { useGetSupplyMetricsQuery } from "@/store/api/tokenomicsApi";

export function CirculatingSupplyCard() {
  const { data: supply, isLoading, isFetching } = useGetSupplyMetricsQuery();

  const showLoadingOverlay = isFetching && !supply;

  // Calculate circulating supply and percentage
  const circulatingSupply = supply?.totalSupply && supply?.unstakedSupply?.base
    ? supply.totalSupply - supply.unstakedSupply.base
    : 0;
  const percentage = supply?.totalSupply ? (circulatingSupply / supply.totalSupply) * 100 : 0;

  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-primary text-lg">Circulating Supply</CardTitle>
        <CardDescription>Currently in circulation</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {isLoading ? (
          <LoadingSpinner className="h-[100px]" />
        ) : (
          supply && (
            <>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedNumber value={circulatingSupply} format={(v) => formatNumber(v)} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">
                  <AnimatedNumber value={percentage} format={(v) => `${v.toFixed(1)}% of total`} />
                </div>
              </div>
              <Progress value={percentage} className="h-1 mt-2" />
              {showLoadingOverlay && <LoadingOverlay />}
            </>
          )
        )}
      </CardContent>
    </Card>
  );
}
