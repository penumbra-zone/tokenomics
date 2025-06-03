import React, { useCallback, useEffect, useMemo, useState } from "react";

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

    const handleLoadingChange = useCallback(
      (cardName: keyof typeof loadingStates) => (isLoading: boolean) => {
        setLoadingStates((prev) => {
          if (prev[cardName] === isLoading) return prev;
          return { ...prev, [cardName]: isLoading };
        });
      },
      []
    );

    const onTotalSupplyLoadingChange = useMemo(
      () => handleLoadingChange("totalSupply"),
      [handleLoadingChange]
    );
    const onPercentStakedLoadingChange = useMemo(
      () => handleLoadingChange("percentStaked"),
      [handleLoadingChange]
    );
    const onMarketCapLoadingChange = useMemo(
      () => handleLoadingChange("marketCap"),
      [handleLoadingChange]
    );
    const onTotalBurnedLoadingChange = useMemo(
      () => handleLoadingChange("totalBurned"),
      [handleLoadingChange]
    );
    const onInflationLoadingChange = useMemo(
      () => handleLoadingChange("inflation"),
      [handleLoadingChange]
    );

    useEffect(() => {
      const anyLoading = Object.values(loadingStates).some((status) => status);
      onAggregateLoadingChange?.(anyLoading);
    }, [loadingStates, onAggregateLoadingChange]);

    return (
      <SharePreviewWrapper ref={ref}>
        <div className="grid grid-cols-3 gap-4 row-auto">
          <TotalSupplyCard onLoadingChange={onTotalSupplyLoadingChange} />
          <PercentStakedOfTotalSupplyCard onLoadingChange={onPercentStakedLoadingChange} />
          <MarketCapCard onLoadingChange={onMarketCapLoadingChange} />
          <TotalBurnedCard onLoadingChange={onTotalBurnedLoadingChange} />
          <InflationCard cardClassName="col-span-2" onLoadingChange={onInflationLoadingChange} />
        </div>
      </SharePreviewWrapper>
    );
  }
);

SummarySharePreview.displayName = "SummarySharePreview";

export default SummarySharePreview;
