import dotenv from "dotenv";
import { logEnvValidationIssues, serverEnvSchema } from "./validation";
import { Env, Network, type BlobStorageConfig } from "./types";

dotenv.config();

// Helper to build blobStorageConfig
const buildBlobStorageConfig = (): BlobStorageConfig | undefined => {
  const vercelToken = process.env.BLOB_READ_WRITE_TOKEN;
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const awsRegion = process.env.AWS_S3_REGION;
  const awsBucketName = process.env.AWS_S3_BUCKET_NAME;

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

let _env: ReturnType<typeof serverEnvSchema.parse> | undefined;

export function getEnv() {
  if (_env) return _env;

  const rawEnv = {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV as Env,
    NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK as Network | undefined,
    NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT: process.env.NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT,
    BASE_URL:
      process.env.NODE_ENV === Env.Production
        ? "https://tokenomics-dashboard-sand.vercel.app/"
        : process.env.BASE_URL || "http://localhost:3000",
    blobStorageConfig: buildBlobStorageConfig(),
  };

  const parseResult = serverEnvSchema.safeParse(rawEnv);

  if (!parseResult.success) {
    logEnvValidationIssues(parseResult);
    return rawEnv;
  }

  _env = parseResult.data;
  return _env;
}
