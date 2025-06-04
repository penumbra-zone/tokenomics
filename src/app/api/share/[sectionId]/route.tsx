import { SECTION_IDS, SectionId } from "@/lib/types/sections";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { blobStorageService } from "@/lib/blob-storage";

export const runtime = "edge";

const IMAGE_MAP: Record<SectionId, string> = {
  [SECTION_IDS.SUMMARY]: "summary.png",
  [SECTION_IDS.SUPPLY_VISUALIZATION]: "supply-visualization.png",
  [SECTION_IDS.ISSUANCE_METRICS]: "issuance-metrics.png",
  [SECTION_IDS.BURN_METRICS]: "burn-metrics.png",
  [SECTION_IDS.TOKEN_DISTRIBUTION]: "token-distribution.png",
  [SECTION_IDS.LQT]: "lqt.png",
};

const DEFAULT_IMAGE_FILE = "default.png";

export async function GET(req: NextRequest, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  const imageFile = IMAGE_MAP[sectionId as SectionId] || DEFAULT_IMAGE_FILE;

  const baseUrl = req.nextUrl.origin;

  try {
    const imageBlobData = await blobStorageService.get(`og-images/${imageFile}`);
    if (!imageBlobData) {
      throw new Error(`Image file ${imageFile} not found`);
    }

    const imageBuffer = imageBlobData.content;

    let base64 = "";
    const bytes = new Uint8Array(imageBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      base64 += String.fromCharCode(bytes[i]);
    }
    const dataUrl = `data:image/png;base64,${btoa(base64)}`;

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0a0a",
          }}
        >
          <img
            src={dataUrl}
            width={1200}
            height={630}
            style={{ objectFit: "cover" }}
            alt={`OG Image for ${sectionId}`}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error(`Error generating OG image for ${sectionId}:`, error);
    const defaultErrorImageFile = "default-error.png";
    const errorImageUrlToFetch = `${baseUrl}/og-images/${defaultErrorImageFile}`;
    try {
      const errorResponse = await fetch(errorImageUrlToFetch);
      if (!errorResponse.ok) throw new Error("Default error image not found");
      const errorImageBuffer = await errorResponse.arrayBuffer();
      let errorBase64 = "";
      const errorBytes = new Uint8Array(errorImageBuffer);
      for (let i = 0; i < errorBytes.byteLength; i++) {
        errorBase64 += String.fromCharCode(errorBytes[i]);
      }
      const errorDataUrl = `data:image/png;base64,${btoa(errorBase64)}`;
      return new ImageResponse(
        <img src={errorDataUrl} width={1200} height={630} alt="Error generating image" />,
        { width: 1200, height: 630 }
      );
    } catch (fallbackError) {
      console.error("Error fetching fallback image:", fallbackError);
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 40,
              color: "white",
              background: "black",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Error generating image
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }
  }
}
