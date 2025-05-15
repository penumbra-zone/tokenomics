import dynamic from "next/dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/Card";

// Import chart component with SSR disabled
const TokenDistributionChart = dynamic(
  () => import("@/modules/tokenomics/components/TokenDistributionChart"),
  { ssr: false }
);

interface TokenDistributionCardProps {
  data: any[]; // Replace with the correct type for distribution data
}

export function TokenDistributionCard({ data }: TokenDistributionCardProps) {
  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Token Distribution</CardTitle>
        <CardDescription>Allocation of total token supply</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <TokenDistributionChart data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
