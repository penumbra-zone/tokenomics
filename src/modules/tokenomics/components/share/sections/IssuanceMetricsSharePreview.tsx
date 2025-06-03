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
    currentIssuance: true, // Handles own loading
    annualIssuance: true, // Handles own loading
    inflation: true,
  });

  const handleLoadingChange = (cardName: keyof typeof loadingStates) => (isLoading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [cardName]: isLoading }));
  };

  // Simulate loading completion for cards that don't have onLoadingChange prop
  useEffect(() => {
    handleLoadingChange("currentIssuance")(false);
    handleLoadingChange("annualIssuance")(false);
  }, []);

  useEffect(() => {
    const anyLoading = Object.values(loadingStates).some((status) => status);
    onAggregateLoadingChange?.(anyLoading);
  }, [loadingStates, onAggregateLoadingChange]);

  return (
    <SharePreviewWrapper ref={ref}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CurrentIssuanceCard />
        <AnnualIssuanceCard />
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
