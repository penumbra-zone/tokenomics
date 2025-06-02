import dotenv from "dotenv";

dotenv.config();

export enum Env {
  Development = "development",
  Production = "production",
  Test = "test",
}

export enum Network {
  Mainnet = "mainnet",
  Testnet = "testnet",
  Devnet = "devnet",
}

interface ServerEnvVars {
  DATABASE_URL: string;
  NODE_ENV: Env;
  NEXT_PUBLIC_NETWORK?: Network;
  NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT?: string;
  BASE_URL: string;
}

function getEnvVar(key: keyof ServerEnvVars): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

function getOptionalEnvVar(key: keyof ServerEnvVars): string | undefined {
  return process.env[key];
}

export const env: ServerEnvVars = {
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  NODE_ENV: getEnvVar("NODE_ENV") as Env,
  NEXT_PUBLIC_NETWORK: getOptionalEnvVar("NEXT_PUBLIC_NETWORK") as Network | undefined,
  NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT: getOptionalEnvVar("NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT"),
  BASE_URL:
    getEnvVar("NODE_ENV") === Env.Production
      ? "https://tokenomics-dashboard-sand.vercel.app/"
      : getOptionalEnvVar("BASE_URL") || "http://localhost:3000",
};