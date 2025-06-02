export const SECTION_IDS = {
  SUMMARY: "summary",
  SUPPLY_VISUALIZATION: "supply-visualization",
  ISSUANCE_METRICS: "issuance-metrics",
  BURN_METRICS: "burn-metrics",
  TOKEN_DISTRIBUTION: "token-distribution",
  LQT: "lqt",
} as const;

export type SectionId = typeof SECTION_IDS[keyof typeof SECTION_IDS];

