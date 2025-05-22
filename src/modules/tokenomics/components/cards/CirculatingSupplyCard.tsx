import InfoCard from "@/components/shared/InfoCard";
import AnimatedNumber from "@/components/AnimatedNumber";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/utils";
import { useGetSupplyMetricsQuery } from "@/store/api/tokenomicsApi";

export function CirculatingSupplyCard() {
  const { data: supply, isLoading } = useGetSupplyMetricsQuery();

  const circulatingSupply =
    supply?.totalSupply && supply?.unstakedSupply?.base
      ? supply.totalSupply - supply.unstakedSupply.base
      : 0;
  const percentage = supply?.totalSupply ? (circulatingSupply / supply.totalSupply) * 100 : 0;

  const descriptionContent = supply ? (
    <>
      Currently in circulation <br />
      <div className="flex items-center justify-between mt-1">
        <div className="text-xs text-muted-foreground">
          <AnimatedNumber value={percentage} format={(v) => `${v.toFixed(1)}% of total`} />
        </div>
      </div>
      <Progress value={percentage} className="h-1 mt-1 w-full" />
    </>
  ) : (
    "Currently in circulation"
  );

  return (
    <InfoCard
      title="Circulating Supply"
      isLoading={isLoading}
      value={circulatingSupply}
      valueFormatter={(v) => formatNumber(v)}
      valueClassName="text-2xl" // Override default text-4xl if needed for this card
      description={descriptionContent}
      // Relies on InfoCard -> CardWrapper default bg/border
    />
  );
}
