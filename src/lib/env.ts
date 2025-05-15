import dotenv from "dotenv";

dotenv.config();

interface EnvVars {
  DATABASE_URL: string;
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
};
