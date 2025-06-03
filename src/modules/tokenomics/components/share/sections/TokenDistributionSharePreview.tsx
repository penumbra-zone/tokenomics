import { secondaryThemeColors } from "@/common/styles/themeColors"; // For PercentStakedOfTotalSupplyCard
import React, { useEffect, useState } from "react";
import { CirculatingSupplyCard, PercentStakedOfTotalSupplyCard } from "../../cards";
import SharePreviewWrapper from "../SharePreviewWrapper";

interface TokenDistributionSharePreviewProps {
  onAggregateLoadingChange?: (isLoading: boolean) => void;
}

const TokenDistributionSharePreview = React.forwardRef<
  HTMLDivElement,
  TokenDistributionSharePreviewProps
>(({ onAggregateLoadingChange }, ref) => {
  const [loadingStates, setLoadingStates] = useState({
    circulatingSupply: true, // Handles own loading
    percentStaked: true,
  });

  const handleLoadingChange = (cardName: keyof typeof loadingStates) => (isLoading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [cardName]: isLoading }));
  };

  // Simulate loading completion for cards that don't have onLoadingChange prop
  useEffect(() => {
    handleLoadingChange("circulatingSupply")(false);
  }, []);

  useEffect(() => {
    const anyLoading = Object.values(loadingStates).some((status) => status);
    onAggregateLoadingChange?.(anyLoading);
  }, [loadingStates, onAggregateLoadingChange]);

  return (
    <SharePreviewWrapper ref={ref}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CirculatingSupplyCard />
        <PercentStakedOfTotalSupplyCard
          onLoadingChange={handleLoadingChange("percentStaked")}
          themeColors={secondaryThemeColors} // As used in TokenDistributionSection
        />
      </div>
    </SharePreviewWrapper>
  );
});

TokenDistributionSharePreview.displayName = "TokenDistributionSharePreview";

export default TokenDistributionSharePreview;
