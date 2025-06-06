import InfoCard from "@/common/components/cards/InfoCard";
import { SECTION_IDS } from "@/lib/types/sections";
import { formatNumber } from "@/lib/utils";
import SharePreviewButton from "@/modules/tokenomics/components/SharePreviewButton";
import LiquidityTournamentSharePreview from "@/modules/tokenomics/components/share/sections/LiquidityTournamentSharePreview";
import { SharePreviewProvider } from "@/modules/tokenomics/context/SharePreviewContext";
import { useGetLQTMetricsQuery } from "@/store/api/tokenomicsApi";
import { LQTPositionsTable } from "../LQTPositionsTable";

export default function LiquidityTournamentSection() {
  const { data: lqtMetrics, isLoading } = useGetLQTMetricsQuery();

  return (
    <SharePreviewProvider
      sectionId={SECTION_IDS.LQT}
      SharePreviewComponent={LiquidityTournamentSharePreview}
    >
      <section id="lqt" className="mb-12 pt-16 -mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">LIQUIDITY TOURNAMENT</h2>
          <SharePreviewButton />
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
    </SharePreviewProvider>
  );
}
