import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/Card";
import AnimatedNumber from "@/components/AnimatedNumber";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/utils";

interface CirculatingSupplyCardProps {
  circulatingSupply: number;
  totalSupply: number;
}

export function CirculatingSupplyCard({
  circulatingSupply,
  totalSupply,
}: CirculatingSupplyCardProps) {
  // Calculate percentage with proper decimal handling
  const percentage = totalSupply > 0 ? (circulatingSupply / totalSupply) * 100 : 0;

  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-primary text-lg">Circulating Supply</CardTitle>
        <CardDescription>Currently in circulation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          <AnimatedNumber value={circulatingSupply} format={(v) => formatNumber(v)} />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-muted-foreground">
            <AnimatedNumber value={percentage} format={(v) => `${v.toFixed(1)}% of total`} />
          </div>
        </div>
        <Progress value={percentage} className="h-1 mt-2" />
      </CardContent>
    </Card>
  );
}
