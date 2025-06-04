import { secondaryThemeColors } from "@/common/styles/themeColors"; // For PercentStakedOfTotalSupplyCard
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CirculatingSupplyCard,
  PercentStakedOfTotalSupplyCard,
  TokenDistributionCard,
} from "../../cards";
import SharePreviewWrapper from "../SharePreviewWrapper";

interface TokenDistributionSharePreviewProps {
  onAggregateLoadingChange?: (isLoading: boolean) => void;
}

const TokenDistributionSharePreview = React.forwardRef<
  HTMLDivElement,
  TokenDistributionSharePreviewProps
>(({ onAggregateLoadingChange }, ref) => {
  const [loadingStates, setLoadingStates] = useState({
    circulatingSupply: true,
    percentStaked: true,
    tokenDistribution: true,
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

  const onCirculatingSupplyLoadingChange = useMemo(
    () => handleLoadingChange("circulatingSupply"),
    [handleLoadingChange]
  );
  const onPercentStakedLoadingChange = useMemo(
    () => handleLoadingChange("percentStaked"),
    [handleLoadingChange]
  );
  const onTokenDistributionLoadingChange = useMemo(
    () => handleLoadingChange("tokenDistribution"),
    [handleLoadingChange]
  );

  useEffect(() => {
    const anyLoading = Object.values(loadingStates).some((status) => status);
    onAggregateLoadingChange?.(anyLoading);
  }, [loadingStates, onAggregateLoadingChange]);

  return (
    <SharePreviewWrapper ref={ref}>
      <div className="grid grid-cols-2 gap-4">
        <CirculatingSupplyCard onLoadingChange={onCirculatingSupplyLoadingChange} />
        <PercentStakedOfTotalSupplyCard
          onLoadingChange={onPercentStakedLoadingChange}
          themeColors={secondaryThemeColors}
        />
        <div className="col-span-2">
          <TokenDistributionCard onLoadingChange={onTokenDistributionLoadingChange} />
        </div>
      </div>
    </SharePreviewWrapper>
  );
});

TokenDistributionSharePreview.displayName = "TokenDistributionSharePreview";

export default TokenDistributionSharePreview;
