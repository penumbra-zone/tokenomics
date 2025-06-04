import { blobStorageService } from "@/lib/blob-storage";
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
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    const fileExtension = file.name.split(".").pop() || "png";
    const blobFilename = `og-images/${sectionId}.${fileExtension}`;

    const blob = await blobStorageService.upload(blobFilename, file, {
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url, pathname: blob.pathname });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to upload image", details: errorMessage },
      { status: 500 }
    );
  }
}
