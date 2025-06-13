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

export interface VercelBlobConfig {
  provider: "vercel";
  token: string;
}

export interface S3BlobConfig {
  provider: "s3";
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
}

export type BlobStorageConfig = VercelBlobConfig | S3BlobConfig;

export interface ServerEnvVars {
  DATABASE_URL: string;
  NODE_ENV: Env;
  NEXT_PUBLIC_NETWORK?: Network;
  NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT?: string;
  BASE_URL: string;
  // Unified blob storage configuration object
  blobStorageConfig?: BlobStorageConfig;
} 