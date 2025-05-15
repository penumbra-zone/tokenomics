import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/Card";
import { formatNumber } from "@/lib/utils";

interface LQTMetrics {
  availableRewards: number;
  votingPower: {
    total: number;
  };
  delegatorRewards: number;
  lpRewards: number;
}

interface LQTMetricsCardProps {
  data: LQTMetrics;
}

export function LQTMetricsCard({ data }: LQTMetricsCardProps) {
  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Liquidity Tournament Metrics</CardTitle>
        <CardDescription>LQT rewards and voting power</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Available Rewards</p>
              <p className="text-xl font-bold text-foreground">
                {formatNumber(data.availableRewards)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Voting Power</p>
              <p className="text-xl font-bold text-foreground">
                {formatNumber(data.votingPower.total)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Delegator Rewards</p>
              <p className="text-xl font-bold text-foreground">
                {formatNumber(data.delegatorRewards)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">LP Rewards</p>
              <p className="text-xl font-bold text-foreground">{formatNumber(data.lpRewards)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
