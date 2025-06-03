import { env } from "@/lib/env/server";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;

  if (!sectionId) {
    return NextResponse.json({ error: "sectionId is required" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    const fileExtension = file.name.split(".").pop() || "png";
    const blobFilename = `og-images/${sectionId}.${fileExtension}`;

    const blob = await put(blobFilename, file, {
      access: "public",
      allowOverwrite: true,
      contentType: file.type,
      cacheControlMaxAge: 31536000,
      token: env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      message: "Image uploaded successfully to Vercel Blob",
      filename: blobFilename,
      url: blob.url,
      path: new URL(blob.url).pathname,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to upload image", details: errorMessage },
      { status: 500 }
    );
  }
}
