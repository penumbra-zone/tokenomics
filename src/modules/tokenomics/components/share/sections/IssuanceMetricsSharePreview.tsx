import { secondaryThemeColors } from "@/common/styles/themeColors"; // For InflationCard
import React, { useEffect, useState } from "react";
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

  const handleLoadingChange = (cardName: keyof typeof loadingStates) => (isLoading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [cardName]: isLoading }));
  };

  useEffect(() => {
    const anyLoading = Object.values(loadingStates).some((status) => status);
    onAggregateLoadingChange?.(anyLoading);
  }, [loadingStates, onAggregateLoadingChange]);

  return (
    <SharePreviewWrapper ref={ref}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CurrentIssuanceCard onLoadingChange={handleLoadingChange("currentIssuance")} />
        <AnnualIssuanceCard onLoadingChange={handleLoadingChange("annualIssuance")} />
        <InflationCard
          onLoadingChange={handleLoadingChange("inflation")}
          themeColors={secondaryThemeColors} // As used in IssuanceMetricsSection
        />
      </div>
    </SharePreviewWrapper>
  );
});

IssuanceMetricsSharePreview.displayName = "IssuanceMetricsSharePreview";

export default IssuanceMetricsSharePreview;
