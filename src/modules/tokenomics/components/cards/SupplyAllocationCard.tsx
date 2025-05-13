import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/common/components/ui/Card";
import dynamic from "next/dynamic";

// Import chart component with SSR disabled
const SupplyAllocationChart = dynamic(
  () => import("@/modules/tokenomics/components/SupplyAllocationChart"),
  { ssr: false }
);

interface SupplyAllocationCardProps {
  genesisAllocation: number;
  issuedSinceLaunch: number;
}

export function SupplyAllocationCard({
  genesisAllocation,
  issuedSinceLaunch,
}: SupplyAllocationCardProps) {
  return (
    <Card className="bg-background/60 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Supply Allocation</CardTitle>
        <CardDescription>Genesis vs Issued tokens</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <SupplyAllocationChart
            genesisAllocation={genesisAllocation}
            issuedSinceLaunch={issuedSinceLaunch}
          />
        </div>
      </CardContent>
    </Card>
  );
}
