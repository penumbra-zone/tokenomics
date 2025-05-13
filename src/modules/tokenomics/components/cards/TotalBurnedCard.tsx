import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/common/components/ui/Card";

interface TotalBurnedCardProps {
  totalBurned: number;
  burnRate: number;
}

export function TotalBurnedCard({
  totalBurned,
  burnRate,
}: TotalBurnedCardProps) {
  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-primary text-lg">Total Burned</CardTitle>
        <CardDescription>Tokens removed from supply</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {totalBurned.toLocaleString()}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-muted-foreground">
            Rate: {burnRate.toFixed(4)}/block
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
