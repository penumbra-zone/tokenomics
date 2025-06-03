import React, { useEffect, useState } from "react";

import { InflationCard } from "../../cards/InflationCard";
import { MarketCapCard } from "../../cards/MarketCapCard";
import { PercentStakedOfTotalSupplyCard } from "../../cards/PercentStakedOfTotalSupplyCard";
import { TotalBurnedCard } from "../../cards/TotalBurnedCard";
import { TotalSupplyCard } from "../../cards/TotalSupplyCard";
import SharePreviewWrapper from "../SharePreviewWrapper";

interface SharePreviewProps {
  onAggregateLoadingChange?: (isLoading: boolean) => void;
}

const SummarySharePreview = React.forwardRef<HTMLDivElement, SharePreviewProps>(
  ({ onAggregateLoadingChange }, ref) => {
    const [loadingStates, setLoadingStates] = useState({
      totalSupply: true,
      percentStaked: true,
      marketCap: true,
      totalBurned: true,
      inflation: true,
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
        <div className="grid grid-cols-3 gap-4 row-auto">
          <TotalSupplyCard onLoadingChange={handleLoadingChange("totalSupply")} />
          <PercentStakedOfTotalSupplyCard onLoadingChange={handleLoadingChange("percentStaked")} />
          <MarketCapCard onLoadingChange={handleLoadingChange("marketCap")} />
          <TotalBurnedCard onLoadingChange={handleLoadingChange("totalBurned")} />
          <InflationCard
            cardClassName="col-span-2"
            onLoadingChange={handleLoadingChange("inflation")}
          />
        </div>
      </SharePreviewWrapper>
    );
  }
);

SummarySharePreview.displayName = "SummarySharePreview";

export default SummarySharePreview;
