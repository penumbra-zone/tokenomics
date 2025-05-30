export enum Network {
  Mainnet = "mainnet",
  Testnet = "testnet",
  Devnet = "devnet",
}

interface ClientEnvVars {
  NEXT_PUBLIC_NETWORK?: Network;
  NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT?: string;
}

function getOptionalClientEnvVar(key: keyof ClientEnvVars): string | undefined {
  return process.env[key];
}

export const env: ClientEnvVars = {
  NEXT_PUBLIC_NETWORK: getOptionalClientEnvVar("NEXT_PUBLIC_NETWORK") as Network | undefined,
  NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT: getOptionalClientEnvVar("NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT"),
};

/**
 * Helper function to check if liquidity tournament section should be shown
 * Defaults to false if not set
 */
export const shouldShowLiquidityTournament = (): boolean => {
  return env.NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT === 'true';
}; 