import { SECTION_IDS, type SectionId } from "@/lib/types/sections";

export interface ShareOptions {
  elementRef: React.RefObject<HTMLElement>;
  shareConfig: ShareConfigEntry;
  onShowPreview: (previewData: SharePreviewData) => void;
}

export interface SharePreviewData {
  imageUrl: string;
  title: string;
  description: string;
  sectionName: string;
  sectionId: SectionId;
  fileName: string;
}

export interface ShareConfigEntry {
  id: SectionId;
  fileName: string;
  title: string;
  description: string;
  sectionName: string;
  sectionId: SectionId;
}

export const shareConfigs: Record<SectionId, ShareConfigEntry> = {
  [SECTION_IDS.SUMMARY]: {
    id: SECTION_IDS.SUMMARY,
    fileName: "penumbra-summary",
    title: "Penumbra Summary",
    description: "Check out the latest Penumbra tokenomics summary! 🌙📊 Key metrics at a glance",
    sectionName: "Summary",
    sectionId: SECTION_IDS.SUMMARY,
  },
  [SECTION_IDS.SUPPLY_VISUALIZATION]: {
    id: SECTION_IDS.SUPPLY_VISUALIZATION,
    fileName: "penumbra-supply",
    title: "Penumbra Supply Visualization",
    description: "Penumbra token supply visualization 📈🔍 See how tokens are distributed",
    sectionName: "Supply Visualization",
    sectionId: SECTION_IDS.SUPPLY_VISUALIZATION,
  },
  [SECTION_IDS.BURN_METRICS]: {
    id: SECTION_IDS.BURN_METRICS,
    fileName: "penumbra-burn-metrics",
    title: "Penumbra Burn Metrics",
    description: "Penumbra token burn metrics 🔥♻️ Deflationary mechanics in action",
    sectionName: "Burn Metrics",
    sectionId: SECTION_IDS.BURN_METRICS,
  },
  [SECTION_IDS.ISSUANCE_METRICS]: {
    id: SECTION_IDS.ISSUANCE_METRICS,
    fileName: "penumbra-issuance",
    title: "Penumbra Issuance Metrics",
    description: "Penumbra token issuance metrics 📊💎 New token creation insights",
    sectionName: "Issuance Metrics",
    sectionId: SECTION_IDS.ISSUANCE_METRICS,
  },
  [SECTION_IDS.TOKEN_DISTRIBUTION]: {
    id: SECTION_IDS.TOKEN_DISTRIBUTION,
    fileName: "penumbra-token-distribution",
    title: "Penumbra Token Distribution",
    description: "Understanding Penumbra\'s token distribution. 🥧",
    sectionName: "Token Distribution",
    sectionId: SECTION_IDS.TOKEN_DISTRIBUTION,
  },
  [SECTION_IDS.LQT]: {
    id: SECTION_IDS.LQT,
    fileName: "penumbra-lqt",
    title: "Penumbra Liquidity Tournament",
    description: "Penumbra Liquidity Tournament stats 🏆🌊 Providing liquidity rewards",
    sectionName: "Liquidity Tournament",
    sectionId: SECTION_IDS.LQT,
  },
};
