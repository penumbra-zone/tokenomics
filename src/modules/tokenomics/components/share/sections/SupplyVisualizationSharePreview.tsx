import React, { useEffect, useState } from "react";
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

  const handleLoadingChange = (cardName: keyof typeof loadingStates) => (isLoading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [cardName]: isLoading }));
  };

  useEffect(() => {
    const anyLoading = Object.values(loadingStates).some((status) => status);
    onAggregateLoadingChange?.(anyLoading);
  }, [loadingStates, onAggregateLoadingChange]);

  return (
    <SharePreviewWrapper ref={ref}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TotalSupplyCard onLoadingChange={handleLoadingChange("totalSupply")} />
        <MarketCapCard onLoadingChange={handleLoadingChange("marketCap")} />
      </div>
    </SharePreviewWrapper>
  );
});

SupplyVisualizationSharePreview.displayName = "SupplyVisualizationSharePreview";

export default SupplyVisualizationSharePreview;
