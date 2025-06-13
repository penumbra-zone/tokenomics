import { z, type RefinementCtx } from "zod";
import { BlobStorageConfig } from './types';

/**
 * Helper function to log environment validation issues
 * @param result - The result from Zod's safeParse
 */
export function logEnvValidationIssues(result: z.SafeParseReturnType<any, any>) {
  if (!result.error) return;
  
  const title =  "⚠️ Environment Variable Validation Warnings";
  console.warn(`\n${title}:`);
  console.warn("==========================================");
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    console.warn(`\n🔍 ${path}:`);
    console.warn(`   ${issue.message}`);
  });
  console.warn("\n==========================================");
}

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

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_NETWORK: z.enum(["mainnet", "testnet", "devnet"]).optional(),
  NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT: z.string().optional(),
});

export const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().min(1),
    NEXT_PUBLIC_NETWORK: z.enum(["mainnet", "testnet", "devnet"]).optional(),
    NEXT_PUBLIC_SHOW_LIQUIDITY_TOURNAMENT: z.string().optional(),
    BASE_URL: z.string().url().optional(),
    blobStorageConfig: z.custom<BlobStorageConfig>().optional(),

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