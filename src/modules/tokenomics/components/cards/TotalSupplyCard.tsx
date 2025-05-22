import { Card, CardDescription, CardTitle } from "@/common/components/ui/Card";
import { LoadingSpinner } from "@/common/components/ui/LoadingSpinner";
import AnimatedNumber from "@/components/AnimatedNumber";
import { formatNumber } from "@/lib/utils";
import { useGetSupplyMetricsQuery } from "@/store/api/tokenomicsApi";

export function TotalSupplyCard() {
  const { data: supply, isLoading } = useGetSupplyMetricsQuery();

  return (
    <Card className="bg-neutral-900/80 border-neutral-800/80 rounded-lg p-6 min-h-[160px] flex flex-col justify-center">
      <CardTitle className="text-base font-medium text-neutral-50 mb-1">Total Supply</CardTitle>
      {isLoading ? (
        <LoadingSpinner className="h-10 w-10 mx-auto" />
      ) : (
        supply && (
          <div className="text-4xl font-bold text-primary">
            <AnimatedNumber value={supply.totalSupply} format={(v) => formatNumber(v, 1)} />
          </div>
        )
      )}
      <CardDescription className="text-xs text-neutral-500 mt-1">
        Maximum Token Supply
      </CardDescription>
    </Card>
  );
}
