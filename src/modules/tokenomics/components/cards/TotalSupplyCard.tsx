import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/Card";
import AnimatedNumber from "@/components/AnimatedNumber";
import { formatNumber } from "@/lib/utils";

interface TotalSupplyCardProps {
  totalSupply: number;
  genesisAllocation: number;
}

export function TotalSupplyCard({ totalSupply, genesisAllocation }: TotalSupplyCardProps) {
  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-primary text-lg">Total Supply</CardTitle>
        <CardDescription>Maximum token supply</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          <AnimatedNumber value={totalSupply} format={(v) => formatNumber(v)} />
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Genesis: <AnimatedNumber value={genesisAllocation} format={(v) => formatNumber(v)} />
        </div>
      </CardContent>
    </Card>
  );
}
