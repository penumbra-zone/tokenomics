import type { VercelBlobConfig } from "@/lib/env/server"; // Import the shared type
import type { ListBlobResult, PutBlobResult } from "@vercel/blob";
import { del, list, put } from "@vercel/blob";
import type { BlobStorageService } from ".";

export class VercelBlobService implements BlobStorageService {
  private vercelToken: string; // Store the token

  constructor(config: VercelBlobConfig) {
    // Use imported VercelBlobConfig
    if (!config.token) {
      throw new Error("Vercel Blob token is not provided in configuration.");
    }
    this.vercelToken = config.token;
  }

  private getToken(options?: Record<string, any>): string | undefined {
    // Prioritize token from options if provided (e.g., for specific operations),
    // otherwise use the service's configured token.
    return options?.token || this.vercelToken;
  }

  async upload(
    pathname: string,
    body: File | string | ReadableStream | Blob,
    options?: Record<string, any>
  ): Promise<PutBlobResult> {
    const token = this.getToken(options);
    return put(pathname, body, {
      access: "public",
      allowOverwrite: true,
      contentType: options?.contentType,
      cacheControlMaxAge: options?.cacheControlMaxAge || 31536000, // 1 year
      token, // This will now use the potentially overridden or instance token
      ...options,
    });
  }

  async get(
    pathname: string
  ): Promise<{ content: ArrayBuffer; contentType: string | null } | null> {
    // List still needs a token, ensure it uses the instance token
    const listResult = await this.list(pathname, { token: this.vercelToken });
    const blobItem = listResult.blobs.find((blob) => blob.pathname === pathname);

    if (!blobItem) {
      return null;
    }

    const response = await fetch(blobItem.url); // Fetch doesn't need a Vercel token directly for public URLs
    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.statusText}`);
    }
    const content = await response.arrayBuffer();
    const contentType = response.headers.get("content-type");
    return { content, contentType };
  }

  async list(prefix: string, options?: Record<string, any>): Promise<ListBlobResult> {
    const token = this.getToken(options);
    return list({
      prefix,
      token, // Uses instance token or overridden token
      ...options,
    });
  }

  async delete(url: string | string[], options?: Record<string, any>): Promise<void> {
    const token = this.getToken(options);
    await del(url, {
      token, // Uses instance token or overridden token
      ...options,
    });
  }
}
