import { SECTION_IDS, SectionId } from "@/lib/types/sections";
import fs from "fs";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import path from "path";

export const runtime = "nodejs";

const IMAGE_MAP: Record<SectionId, string> = {
  [SECTION_IDS.SUMMARY]: "summary.png",
  [SECTION_IDS.SUPPLY_VISUALIZATION]: "supply-visualization.png",
  [SECTION_IDS.ISSUANCE_METRICS]: "issuance-metrics.png",
  [SECTION_IDS.BURN_METRICS]: "burn-metrics.png",
  [SECTION_IDS.TOKEN_DISTRIBUTION]: "token-distribution.png",
  [SECTION_IDS.LQT]: "lqt.png",
};

export async function GET(_req: NextRequest, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  const imageFile = IMAGE_MAP[sectionId as SectionId] || "default.png";
  const imagePath = path.join(process.cwd(), "public", "og-images", imageFile);

  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={dataUrl}
            width={1200}
            height={630}
            style={{ objectFit: "cover", borderRadius: 0 }}
            alt={sectionId}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    return new Response("Image not found", { status: 404 });
  }
}
