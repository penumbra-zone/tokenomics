import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MarketCapCard, SupplyAllocationCard, TotalSupplyCard } from "../../cards";
import SharePreviewWrapper from "../SharePreviewWrapper";

interface SupplyVisualizationSharePreviewProps {
  onAggregateLoadingChange?: (isLoading: boolean) => void;
}

const SupplyVisualizationSharePreview = React.forwardRef<
  HTMLDivElement,
  SupplyVisualizationSharePreviewProps
>(({ onAggregateLoadingChange }, ref) => {
  const [loadingStates, setLoadingStates] = useState({
    genesisVsCirculating: true,
    totalSupply: true,
    marketCap: true,
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

  const onSupplyAllocationLoadingChange = useMemo(
    () => handleLoadingChange("genesisVsCirculating"),
    [handleLoadingChange]
  );

  const onTotalSupplyLoadingChange = useMemo(
    () => handleLoadingChange("totalSupply"),
    [handleLoadingChange]
  );

  const onMarketCapLoadingChange = useMemo(
    () => handleLoadingChange("marketCap"),
    [handleLoadingChange]
  );

  useEffect(() => {
    const anyLoading = Object.values(loadingStates).some((status) => status);
    onAggregateLoadingChange?.(anyLoading);
  }, [loadingStates, onAggregateLoadingChange]);

  return (
    <SharePreviewWrapper ref={ref}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"> 
          <SupplyAllocationCard onLoadingChange={onSupplyAllocationLoadingChange} />
        </div>
        <TotalSupplyCard onLoadingChange={onTotalSupplyLoadingChange} />
        <MarketCapCard onLoadingChange={onMarketCapLoadingChange} />
      </div>
    </SharePreviewWrapper>
  );
});

SupplyVisualizationSharePreview.displayName = "SupplyVisualizationSharePreview";

export default SupplyVisualizationSharePreview;
