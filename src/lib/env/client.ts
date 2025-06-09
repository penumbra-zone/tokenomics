import { logEnvValidationIssues, clientEnvSchema } from "./validation";

const rawEnv = {
  NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
  NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT: process.env.NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT,
};

const parseResult = clientEnvSchema.safeParse(rawEnv);

export const env = parseResult.data;

if (!parseResult.success) {
  logEnvValidationIssues(parseResult);
}

/**
 * Helper function to check if liquidity tournament section should be shown
 * Defaults to false if not set
 */
export const shouldShowLiquidityTournament = (): boolean => {
  return env?.NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT === "true";
};
