import dotenv from "dotenv";
import { z, type RefinementCtx } from "zod";

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

interface ServerEnvVars {
  DATABASE_URL: string;
  NODE_ENV: Env;
  NEXT_PUBLIC_NETWORK?: Network;
  NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT?: string;
  BASE_URL: string;
  // Unified blob storage configuration object
  blobStorageConfig?: BlobStorageConfig;
}

function getEnvVar(key: string): string {
  // Changed key type to string for broader use
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

function getOptionalEnvVar(key: string): string | undefined {
  // Changed key type to string
  return process.env[key];
}

// Helper to build blobStorageConfig
const buildBlobStorageConfig = (): BlobStorageConfig | undefined => {
  const vercelToken = getOptionalEnvVar("BLOB_READ_WRITE_TOKEN");
  const awsAccessKeyId = getOptionalEnvVar("AWS_ACCESS_KEY_ID");
  const awsSecretAccessKey = getOptionalEnvVar("AWS_SECRET_ACCESS_KEY");
  const awsRegion = getOptionalEnvVar("AWS_S3_REGION");
  const awsBucketName = getOptionalEnvVar("AWS_S3_BUCKET_NAME");

  if (awsAccessKeyId && awsSecretAccessKey && awsRegion && awsBucketName) {
    // Prioritize S3 if all its variables are set
    return {
      provider: "s3",
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
      region: awsRegion,
      bucketName: awsBucketName,
    };
  } else if (vercelToken) {
    return {
      provider: "vercel",
      token: vercelToken,
    };
  }
  return undefined;
};

export const env: ServerEnvVars = {
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  NODE_ENV: getEnvVar("NODE_ENV") as Env,
  NEXT_PUBLIC_NETWORK: getOptionalEnvVar("NEXT_PUBLIC_NETWORK") as Network | undefined,
  NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT: getOptionalEnvVar("NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT"),
  BASE_URL:
    getEnvVar("NODE_ENV") === Env.Production
      ? "https://tokenomics-dashboard-sand.vercel.app/"
      : getOptionalEnvVar("BASE_URL") || "http://localhost:3000",
  blobStorageConfig: buildBlobStorageConfig(),
};

// Zod schemas for validation
export const vercelBlobConfigSchema = z.object({
  provider: z.literal("vercel"),
  token: z.string().min(1, "Vercel blob token cannot be empty"),
});

export const s3BlobConfigSchema = z.object({
  provider: z.literal("s3"),
  accessKeyId: z.string().min(1, "AWS Access Key ID cannot be empty"),
  secretAccessKey: z.string().min(1, "AWS Secret Access Key cannot be empty"),
  region: z.string().min(1, "AWS S3 Region cannot be empty"),
  bucketName: z.string().min(1, "AWS S3 Bucket Name cannot be empty"),
});

export const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().min(1),
    NEXT_PUBLIC_NETWORK: z.enum(["mainnet", "testnet", "devnet"]).optional(),
    NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT: z.string().optional(),
    BASE_URL: z.string().url().optional(),

    BLOB_READ_WRITE_TOKEN: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_S3_REGION: z.string().optional(),
    AWS_S3_BUCKET_NAME: z.string().optional(),
  })
  .superRefine(
    (
      data: {
        BLOB_READ_WRITE_TOKEN?: string;
        AWS_ACCESS_KEY_ID?: string;
        AWS_SECRET_ACCESS_KEY?: string;
        AWS_S3_REGION?: string;
        AWS_S3_BUCKET_NAME?: string;
      },
      ctx: RefinementCtx
    ) => {
      const s3VarsSet = [
        data.AWS_ACCESS_KEY_ID,
        data.AWS_SECRET_ACCESS_KEY,
        data.AWS_S3_REGION,
        data.AWS_S3_BUCKET_NAME,
      ];
      const s3AllSet = s3VarsSet.every(Boolean);
      const s3SomeSet = s3VarsSet.some(Boolean);

      if (data.BLOB_READ_WRITE_TOKEN && s3AllSet) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Cannot define both Vercel BLOB_READ_WRITE_TOKEN and all AWS S3 variables. Please choose one provider.",
          path: ["BLOB_READ_WRITE_TOKEN"],
        });
      }
      if (!data.BLOB_READ_WRITE_TOKEN && s3SomeSet && !s3AllSet) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "If using AWS S3, all variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_REGION, AWS_S3_BUCKET_NAME) must be set., \n If using Vercel, please set BLOB_READ_WRITE_TOKEN",
          path: ["AWS_ACCESS_KEY_ID"],
        });
      }
    }
  );

// Validate environment variables
const result = serverEnvSchema.safeParse(process.env);
if (!result.success) {
  console.error("\n❌ Environment Variable Validation Failed:");
  console.error("==========================================");
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    console.error(`\n🔍 ${path}:`);
    console.error(`   ${issue.message}`);
  });
  console.error("\n==========================================");
  process.exit(1);
}

/**
 * @type {Record<keyof z.infer<typeof serverEnvSchema> , string | undefined>}
 */
