import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/common/components/ui/Card";
import AnimatedNumber from "@/components/AnimatedNumber";

interface MarketCapCardProps {
  marketCap: number;
  price: number;
}

export function MarketCapCard({ marketCap, price }: MarketCapCardProps) {
  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-primary text-lg">Market Cap</CardTitle>
        <CardDescription>Current valuation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          <AnimatedNumber
            value={marketCap}
            format={(v) =>
              `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
            }
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-muted-foreground">
            Price:{" "}
            <AnimatedNumber value={price} format={(v) => `$${v.toFixed(2)}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
