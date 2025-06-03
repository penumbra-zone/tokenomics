import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MarketCapCard, TotalSupplyCard } from "../../cards";
import SharePreviewWrapper from "../SharePreviewWrapper";

interface SupplyVisualizationSharePreviewProps {
  onAggregateLoadingChange?: (isLoading: boolean) => void;
}

const SupplyVisualizationSharePreview = React.forwardRef<
  HTMLDivElement,
  SupplyVisualizationSharePreviewProps
>(({ onAggregateLoadingChange }, ref) => {
  const [loadingStates, setLoadingStates] = useState({
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TotalSupplyCard onLoadingChange={onTotalSupplyLoadingChange} />
        <MarketCapCard onLoadingChange={onMarketCapLoadingChange} />
      </div>
    </SharePreviewWrapper>
  );
});

SupplyVisualizationSharePreview.displayName = "SupplyVisualizationSharePreview";

export default SupplyVisualizationSharePreview;
