import React, { useEffect, useState } from "react";
import {
  BurnMetricsCard,
  BurnRateOverTimeCard,
  PercentBurnedOfTotalSupplyCard,
  TotalBurnedCard,
  WhyBurningIsImportantCard,
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

    const handleLoadingChange = (cardName: keyof typeof loadingStates) => (isLoading: boolean) => {
      setLoadingStates((prev) => ({ ...prev, [cardName]: isLoading }));
    };

    useEffect(() => {
      const anyLoading = Object.values(loadingStates).some((status) => status);
      onAggregateLoadingChange?.(anyLoading);
    }, [loadingStates, onAggregateLoadingChange]);

    return (
      <SharePreviewWrapper ref={ref}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <BurnMetricsCard onLoadingChange={handleLoadingChange("burnMetrics")} />
          </div>
          <TotalBurnedCard onLoadingChange={handleLoadingChange("totalBurned")} />
          <PercentBurnedOfTotalSupplyCard onLoadingChange={handleLoadingChange("percentBurned")} />
          <div className="col-span-2">
            <WhyBurningIsImportantCard />
          </div>
          <div className="col-span-2">
            <BurnRateOverTimeCard onLoadingChange={handleLoadingChange("burnRateOverTime")} />
          </div>
        </div>
      </SharePreviewWrapper>
    );
  }
);

BurnMetricsSharePreview.displayName = "BurnMetricsSharePreview";

export default BurnMetricsSharePreview;
