import { Share2 } from "lucide-react";

import ShareButton from "@/modules/tokenomics/components/ShareButton";
import { LQTMetricsCard } from "@/modules/tokenomics/components/cards";

interface SectionProps {
  handleShare: () => void;
}

export default function LiquidityTournamentSection({ handleShare }: SectionProps) {
  return (
    <section id="lqt" className="mb-12 pt-16 -mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">LIQUIDITY TOURNAMENT</h2>
        <ShareButton onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </ShareButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Placeholders for Available Rewards, Delegator Rewards, LP Rewards, Total Voting Power */}
      </div>
      <div className="grid grid-cols-1 gap-6">
        <LQTMetricsCard />
      </div>
    </section>
  );
}
