import React from "react";

import { InflationCard } from "../cards/InflationCard";
import { MarketCapCard } from "../cards/MarketCapCard";
import { PercentStakedOfTotalSupplyCard } from "../cards/PercentStakedOfTotalSupplyCard";
import { TotalBurnedCard } from "../cards/TotalBurnedCard";
import { TotalSupplyCard } from "../cards/TotalSupplyCard";
import SharePreviewWrapper from "./SharePreviewWrapper";

const SharePreview = React.forwardRef<HTMLDivElement>((_props, ref) => {
  return (
    <SharePreviewWrapper ref={ref}>
      <div className="grid grid-cols-3 gap-4 row-auto">
        <TotalSupplyCard />
        <PercentStakedOfTotalSupplyCard />
        <MarketCapCard />
        <TotalBurnedCard />
        <InflationCard cardClassName="col-span-2" />
      </div>
    </SharePreviewWrapper>
  );
});

SharePreview.displayName = "SummarySharePreview";

export default SharePreview;
