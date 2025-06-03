import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BurnMetricsCard,
  BurnRateOverTimeCard,
  PercentBurnedOfTotalSupplyCard,
  TotalBurnedCard,
} from "../../cards";
import SharePreviewWrapper from "../SharePreviewWrapper";

interface BurnMetricsSharePreviewProps {
  onAggregateLoadingChange?: (isLoading: boolean) => void;
}

const BurnMetricsSharePreview = React.forwardRef<HTMLDivElement, BurnMetricsSharePreviewProps>(
  ({ onAggregateLoadingChange }, ref) => {
    const [loadingStates, setLoadingStates] = useState({
      burnMetrics: true,
      totalBurned: true,
      percentBurned: true,
      burnRateOverTime: true,
    });

    const handleLoadingChange = useCallback(
      (cardName: keyof typeof loadingStates) => (isLoading: boolean) => {
        setLoadingStates((prev) => {
          if (prev[cardName] === isLoading) return prev;
          return { ...prev, [cardName]: isLoading };
        });
      },
      []
    );

    const onBurnMetricsLoadingChange = useMemo(
      () => handleLoadingChange("burnMetrics"),
      [handleLoadingChange]
    );
    const onTotalBurnedLoadingChange = useMemo(
      () => handleLoadingChange("totalBurned"),
      [handleLoadingChange]
    );
    const onPercentBurnedLoadingChange = useMemo(
      () => handleLoadingChange("percentBurned"),
      [handleLoadingChange]
    );
    const onBurnRateOverTimeLoadingChange = useMemo(
      () => handleLoadingChange("burnRateOverTime"),
      [handleLoadingChange]
    );

    useEffect(() => {
      const anyLoading = Object.values(loadingStates).some((status) => status);
      onAggregateLoadingChange?.(anyLoading);
    }, [loadingStates, onAggregateLoadingChange]);

    return (
      <SharePreviewWrapper ref={ref}>
        <div className="grid grid-cols-2 gap-4">
          <BurnMetricsCard onLoadingChange={onBurnMetricsLoadingChange} />
          <TotalBurnedCard onLoadingChange={onTotalBurnedLoadingChange} />
          <PercentBurnedOfTotalSupplyCard onLoadingChange={onPercentBurnedLoadingChange} />
          <BurnRateOverTimeCard onLoadingChange={onBurnRateOverTimeLoadingChange} />
        </div>
      </SharePreviewWrapper>
    );
  }
);

BurnMetricsSharePreview.displayName = "BurnMetricsSharePreview";

export default BurnMetricsSharePreview;
