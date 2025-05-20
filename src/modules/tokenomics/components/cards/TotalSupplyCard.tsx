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
import { useGetSupplyMetricsQuery } from "@/store/api/tokenomicsApi";

export function TotalSupplyCard() {
  const { data: supply, isLoading, isFetching } = useGetSupplyMetricsQuery();

  const showLoadingOverlay = isFetching && !supply;

  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-primary text-lg">Total Supply</CardTitle>
        <CardDescription>Maximum token supply</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {isLoading ? (
          <LoadingSpinner className="h-[100px]" />
        ) : (
          supply && (
            <>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedNumber value={supply.totalSupply} format={(v) => formatNumber(v)} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Genesis:{" "}
                <AnimatedNumber value={supply.genesisAllocation} format={(v) => formatNumber(v)} />
              </div>
              {showLoadingOverlay && <LoadingOverlay />}
            </>
          )
        )}
      </CardContent>
    </Card>
  );
}
