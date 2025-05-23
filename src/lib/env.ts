import dotenv from "dotenv";

dotenv.config();

export enum Env {
  Development = "development",
  Production = "production",
  Test = "test",
}

interface EnvVars {
  DATABASE_URL: string;
  NODE_ENV: Env;
}

function getEnvVar(key: keyof EnvVars): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const env: EnvVars = {
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  NODE_ENV: getEnvVar("NODE_ENV") as Env,
};
