import { Share2 } from "lucide-react";

import ShareButton from "@/modules/tokenomics/components/ShareButton";
import { TokenMetricsCard } from "@/modules/tokenomics/components/cards";

interface SectionProps {
  handleShare: () => void;
}

export default function IssuanceMetricsSection({ handleShare }: SectionProps) {
  return (
    <section className="mb-12 pt-16 -mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">ISSUANCE METRICS</h2>
        <ShareButton onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </ShareButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Placeholder for Current Issuance, Annual Issuance, Inflation */}
      </div>
      <div className="grid grid-cols-1 gap-6">
        <TokenMetricsCard />
      </div>
    </section>
  );
}
