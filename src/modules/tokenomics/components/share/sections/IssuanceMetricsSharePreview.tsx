import { secondaryThemeColors } from "@/common/styles/themeColors"; // For InflationCard
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnnualIssuanceCard, CurrentIssuanceCard, PriceHistoryCard } from "../../cards"; // Adjusted path
import { InflationCard } from "../../cards/InflationCard"; // Specific import for InflationCard
import SharePreviewWrapper from "../SharePreviewWrapper";

interface IssuanceMetricsSharePreviewProps {
  onAggregateLoadingChange?: (isLoading: boolean) => void;
}

const IssuanceMetricsSharePreview = React.forwardRef<
  HTMLDivElement,
  IssuanceMetricsSharePreviewProps
>(({ onAggregateLoadingChange }, ref) => {
  const [loadingStates, setLoadingStates] = useState({
    currentIssuance: true,
    annualIssuance: true,
    inflation: true,
    priceHistory: true,
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

  const onCurrentIssuanceLoadingChange = useMemo(
    () => handleLoadingChange("currentIssuance"),
    [handleLoadingChange]
  );
  const onAnnualIssuanceLoadingChange = useMemo(
    () => handleLoadingChange("annualIssuance"),
    [handleLoadingChange]
  );
  const onInflationLoadingChange = useMemo(
    () => handleLoadingChange("inflation"),
    [handleLoadingChange]
  );
  const onPriceHistoryLoadingChange = useMemo(
    () => handleLoadingChange("priceHistory"),
    [handleLoadingChange]
  );

  useEffect(() => {
    const anyLoading = Object.values(loadingStates).some((status) => status);
    onAggregateLoadingChange?.(anyLoading);
  }, [loadingStates, onAggregateLoadingChange]);

  return (
    <SharePreviewWrapper ref={ref}>
      <div className="grid grid-cols-3 gap-4">
        <CurrentIssuanceCard onLoadingChange={onCurrentIssuanceLoadingChange} />
        <AnnualIssuanceCard onLoadingChange={onAnnualIssuanceLoadingChange} />
        <InflationCard
          onLoadingChange={onInflationLoadingChange}
          themeColors={secondaryThemeColors}
        />
        <div className="col-span-3">
          <PriceHistoryCard onLoadingChange={onPriceHistoryLoadingChange} />
        </div>
      </div>
    </SharePreviewWrapper>
  );
});

IssuanceMetricsSharePreview.displayName = "IssuanceMetricsSharePreview";

export default IssuanceMetricsSharePreview;
