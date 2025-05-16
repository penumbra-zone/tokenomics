import dynamic from "next/dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/Card";
import { PriceHistory } from "@/store/api/tokenomicsApi";

// Import chart component with SSR disabled
const PriceHistoryChart = dynamic(
  () => import("@/modules/tokenomics/components/PriceHistoryChart"),
  { ssr: false }
);

interface PriceHistoryCardProps {
  data: PriceHistory[];
  onDaysChange?: (days: number) => void;
}

export function PriceHistoryCard({ data, onDaysChange }: PriceHistoryCardProps) {
  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Price History</CardTitle>
        <CardDescription>Token price over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <PriceHistoryChart data={data} onDaysChange={onDaysChange} />
        </div>
        {/* Metrics grid below chart */}
        {data && data.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {/* Current Price */}
            <Card className="bg-background/40 border-border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Current Price</div>
                <div className="text-lg font-bold text-foreground">
                  ${data[data.length - 1].price.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            {/* All-Time High */}
            <Card className="bg-background/40 border-border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">All-Time High</div>
                <div className="text-lg font-bold text-foreground">
                  ${Math.max(...data.map((p) => p.price)).toFixed(2)}
                </div>
              </CardContent>
            </Card>
            {/* All-Time Low */}
            <Card className="bg-background/40 border-border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">All-Time Low</div>
                <div className="text-lg font-bold text-foreground">
                  ${Math.min(...data.map((p) => p.price)).toFixed(2)}
                </div>
              </CardContent>
            </Card>
            {/* 30d Change */}
            <Card className="bg-background/40 border-border">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">30d Change</div>
                <div
                  className={`text-lg font-bold ${
                    data[data.length - 1].price -
                      (data[data.length - 31]?.price ?? data[0].price) >=
                    0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {(() => {
                    const now = data[data.length - 1].price;
                    const prev = data[data.length - 30]?.price ?? data[0].price;
                    const change = ((now - prev) / prev) * 100;
                    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
