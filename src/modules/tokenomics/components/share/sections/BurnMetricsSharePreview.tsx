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
      burnMetrics: true, // BurnMetricsCard handles its own loading, but we track for aggregate
      totalBurned: true,
      percentBurned: true, // PercentBurnedOfTotalSupplyCard handles its own loading
      whyBurningImportant: true, // Assuming WhyBurningIsImportantCard is static or handles own loading
      burnRateOverTime: true, // BurnRateOverTimeCard handles its own loading
    });

    const handleLoadingChange = (cardName: keyof typeof loadingStates) => (isLoading: boolean) => {
      setLoadingStates((prev) => ({ ...prev, [cardName]: isLoading }));
    };

    // Simulate loading completion for cards that don't have onLoadingChange prop
    useEffect(() => {
      handleLoadingChange("burnMetrics")(false);
      handleLoadingChange("percentBurned")(false);
      handleLoadingChange("whyBurningImportant")(false);
      handleLoadingChange("burnRateOverTime")(false);
    }, []);

    useEffect(() => {
      const anyLoading = Object.values(loadingStates).some((status) => status);
      onAggregateLoadingChange?.(anyLoading);
    }, [loadingStates, onAggregateLoadingChange]);

    return (
      <SharePreviewWrapper ref={ref}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <BurnMetricsCard />
          </div>
          <TotalBurnedCard onLoadingChange={handleLoadingChange("totalBurned")} />
          <PercentBurnedOfTotalSupplyCard />
          <div className="col-span-2">
            <WhyBurningIsImportantCard />
          </div>
          <div className="col-span-2">
            <BurnRateOverTimeCard />
          </div>
        </div>
      </SharePreviewWrapper>
    );
  }
);

BurnMetricsSharePreview.displayName = "BurnMetricsSharePreview";

export default BurnMetricsSharePreview;
