import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  type _Object
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "stream";
import type { BlobStorageService } from ".";
import type { S3BlobConfig } from "@/lib/env/server";

export class AWSS3BlobService implements BlobStorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string; 

  constructor(config: S3BlobConfig) {
    if (!config.accessKeyId || !config.secretAccessKey || !config.region || !config.bucketName) {
      throw new Error("AWS S3 configuration passed to service is incomplete.");
    }
    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: `https://s3.${config.region}.amazonaws.com`,
    });
    this.bucketName = config.bucketName;
    this.region = config.region;
  }

  async upload(pathname: string, body: File | string | ReadableStream | Blob, options?: Record<string, any>): Promise<{ url: string; pathname: string }> {
    let inputStream: Readable;
    let contentType: string | undefined = options?.contentType;
    let contentLength: number | undefined = options?.contentLength;

    if (typeof body === 'string') {
      inputStream = Readable.from(body);
      if (!contentType) contentType = 'text/plain';
      contentLength = Buffer.byteLength(body, 'utf-8');
    } else if (body instanceof Blob) { // Covers File as File is a Blob
      inputStream = Readable.fromWeb(body.stream() as any); // any for ReadableStream<Uint8Array>
      if (!contentType) contentType = body.type;
      contentLength = body.size;
    } else if (body instanceof Readable) { // Node.js Readable stream
      inputStream = body;
      // contentType and contentLength should ideally be provided in options for streams
    } else {
      throw new Error("Unsupported body type for S3 upload");
    }

    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: pathname,
          Body: inputStream,
          ContentType: contentType,
          ContentLength: contentLength,
          CacheControl: options?.cacheControlMaxAge ? `max-age=${options.cacheControlMaxAge}` : undefined,
        },
      });

      await upload.done();
      
      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${pathname}`;
      return { url, pathname };
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw error;
    }
  }

  async get(pathname: string): Promise<{ content: ArrayBuffer; contentType: string | null } | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: pathname,
      });
      const response = await this.s3Client.send(command);
      
      if (!response.Body) {
        return null;
      }
      // Convert stream to ArrayBuffer
      const byteArray = await response.Body.transformToByteArray();
      return {
        content: byteArray.buffer as ArrayBuffer,
        contentType: response.ContentType || null,
      };
    } catch (error: any) {
      if (error.name === 'NoSuchKey') {
        return null;
      }
      console.error("S3 Get Error:", error);
      throw error;
    }
  }

  async list(prefix: string): Promise<{ blobs: Array<{ pathname: string; url: string }> }> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
      });
      const response = await this.s3Client.send(command);
      const blobs = response.Contents?.map((item: _Object) => {
        const pathname = item.Key!;
        const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${pathname}`;
        return { pathname, url };
      }) || [];
      return { blobs };
    } catch (error) {
      console.error("S3 List Error:", error);
      throw error;
    }
  }
  
  // Optional: Implement delete if it becomes part of the interface or is needed directly
  async delete(pathname: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: pathname,
      });
      await this.s3Client.send(command);
    } catch (error) {
      console.error("S3 Delete Error:", error);
      throw error;
    }
  }
} 