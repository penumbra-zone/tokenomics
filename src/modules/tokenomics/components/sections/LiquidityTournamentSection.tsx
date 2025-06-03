import InfoCard from "@/common/components/cards/InfoCard";
import { formatNumber } from "@/lib/utils";
import ShareButton from "@/modules/tokenomics/components/ShareButton";
import { useGetLQTMetricsQuery } from "@/store/api/tokenomicsApi";
import { LQTPositionsTable } from "../LQTPositionsTable";

interface SectionProps {
  handleShare: () => void;
  isShareLoading: boolean;
}

export default function LiquidityTournamentSection({ handleShare, isShareLoading }: SectionProps) {
  const { data: lqtMetrics, isLoading } = useGetLQTMetricsQuery();

  return (
    <section id="lqt" className="mb-12 pt-16 -mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">LIQUIDITY TOURNAMENT</h2>
        <ShareButton onClick={handleShare} isContentLoading={isShareLoading} />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <InfoCard
          title="Available Rewards"
          isLoading={isLoading}
          value={lqtMetrics?.availableRewards}
          valueFormatter={(v) => `${formatNumber(v, 0)}`}
        />
        <InfoCard
          title="Delegator Rewards"
          isLoading={isLoading}
          value={lqtMetrics?.delegatorRewards}
          valueFormatter={(v) => `${formatNumber(v, 0)}`}
        />
        <InfoCard
          title="LP Rewards"
          isLoading={isLoading}
          value={lqtMetrics?.lpRewards}
          valueFormatter={(v) => `${formatNumber(v, 0)}`}
        />
        <InfoCard
          title="Total Voting Power"
          isLoading={isLoading}
          value={lqtMetrics?.votingPower?.total}
          valueFormatter={(v) => `${formatNumber(v, 0)}`}
        />
      </div>

      {/* Positions Table */}
      <div className="grid grid-cols-1 gap-6">
        <LQTPositionsTable />
      </div>
    </section>
  );
}
