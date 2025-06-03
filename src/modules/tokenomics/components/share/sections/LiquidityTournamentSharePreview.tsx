import InfoCard from "@/common/components/cards/InfoCard";
import { formatNumber } from "@/lib/utils";
import { useGetLQTMetricsQuery } from "@/store/api/tokenomicsApi";
import React, { useEffect } from "react";
import SharePreviewWrapper from "../SharePreviewWrapper";

interface LiquidityTournamentSharePreviewProps {
  onAggregateLoadingChange?: (isLoading: boolean) => void;
}

const LiquidityTournamentSharePreview = React.forwardRef<
  HTMLDivElement,
  LiquidityTournamentSharePreviewProps
>(({ onAggregateLoadingChange }, ref) => {
  const { data: lqtMetrics, isLoading: isLQTMetricsLoading } = useGetLQTMetricsQuery();

  useEffect(() => {
    onAggregateLoadingChange?.(isLQTMetricsLoading);
  }, [isLQTMetricsLoading, onAggregateLoadingChange]);

  return (
    <SharePreviewWrapper ref={ref}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard
          title="Available Rewards"
          isLoading={isLQTMetricsLoading}
          value={lqtMetrics?.availableRewards}
          valueFormatter={(v) => `${formatNumber(v, 0)}`}
        />
        <InfoCard
          title="Delegator Rewards"
          isLoading={isLQTMetricsLoading}
          value={lqtMetrics?.delegatorRewards}
          valueFormatter={(v) => `${formatNumber(v, 0)}`}
        />
        <InfoCard
          title="LP Rewards"
          isLoading={isLQTMetricsLoading}
          value={lqtMetrics?.lpRewards}
          valueFormatter={(v) => `${formatNumber(v, 0)}`}
        />
        <InfoCard
          title="Total Voting Power"
          isLoading={isLQTMetricsLoading}
          value={lqtMetrics?.votingPower?.total}
          valueFormatter={(v) => `${formatNumber(v, 0)}`}
        />
      </div>
    </SharePreviewWrapper>
  );
});

LiquidityTournamentSharePreview.displayName = "LiquidityTournamentSharePreview";

export default LiquidityTournamentSharePreview;
