import { getEnv } from '@/lib/env/server';
import { AWSS3BlobService } from "./aws-s3";
import { VercelBlobService } from "./vercel-blob";

export interface BlobStorageService {
  upload(
    pathname: string,
    body: File | string | ReadableStream | Blob,
    options?: Record<string, any>
  ): Promise<{ url: string; pathname: string }>;
  get(pathname: string): Promise<{ content: ArrayBuffer; contentType: string | null } | null>;
  list(prefix: string): Promise<{ blobs: Array<{ pathname: string; url: string }> }>;
  // delete?(pathname: string): Promise<void>;
}

const createNotConfiguredService = (): BlobStorageService => ({
  async upload(pathname, body, options) {
    console.error("Attempted to use blob storage upload without configuration", {
      pathname,
      options,
    });
    throw new Error(
      "Blob storage service is not configured. Check environment variables (BLOB_READ_WRITE_TOKEN or AWS S3 vars)."
    );
  },
  async get(pathname) {
    console.error("Attempted to use blob storage get without configuration", { pathname });
    throw new Error("Blob storage service is not configured. Check environment variables.");
  },
  async list(prefix) {
    console.error("Attempted to use blob storage list without configuration", { prefix });
    throw new Error("Blob storage service is not configured. Check environment variables.");
  },
});

let serviceInstance: BlobStorageService;

const env = getEnv();
switch (env.blobStorageConfig?.provider) {
  case "s3":
    serviceInstance = new AWSS3BlobService(env.blobStorageConfig);
    break;
  case "vercel":
    serviceInstance = new VercelBlobService(env.blobStorageConfig);
    break;
  default:
    serviceInstance = createNotConfiguredService();
    break;
}

export const blobStorageService: BlobStorageService = serviceInstance;
