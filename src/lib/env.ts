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

interface EnvVars {
  DATABASE_URL: string;
  NODE_ENV: Env;
  NEXT_PUBLIC_NETWORK?: Network;
}

function getEnvVar(key: keyof EnvVars): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

function getOptionalEnvVar(key: keyof EnvVars): string | undefined {
  return process.env[key];
}

export const env: EnvVars = {
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  NODE_ENV: getEnvVar("NODE_ENV") as Env,
  NEXT_PUBLIC_NETWORK: getOptionalEnvVar("NEXT_PUBLIC_NETWORK") as Network | undefined,
};
