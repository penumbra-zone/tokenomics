import { secondaryThemeColors } from "@/common/styles/themeColors"; // For InflationCard
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnnualIssuanceCard, CurrentIssuanceCard } from "../../cards"; // Adjusted path
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

  useEffect(() => {
    const anyLoading = Object.values(loadingStates).some((status) => status);
    onAggregateLoadingChange?.(anyLoading);
  }, [loadingStates, onAggregateLoadingChange]);

  return (
    <SharePreviewWrapper ref={ref}>
      <div className="grid grid-cols-2 gap-4">
        <CurrentIssuanceCard onLoadingChange={onCurrentIssuanceLoadingChange} />
        <AnnualIssuanceCard onLoadingChange={onAnnualIssuanceLoadingChange} />
        <InflationCard
          cardClassName="col-span-2"
          onLoadingChange={onInflationLoadingChange}
          themeColors={secondaryThemeColors}
        />
      </div>
    </SharePreviewWrapper>
  );
});

IssuanceMetricsSharePreview.displayName = "IssuanceMetricsSharePreview";

export default IssuanceMetricsSharePreview;
