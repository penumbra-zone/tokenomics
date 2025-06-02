import { COLORS } from "@/common/helpers/colors";
import type { SectionId } from "@/lib/types/sections";
import { SECTION_IDS } from "@/lib/types/sections";
import { toPng } from "html-to-image";

export interface ShareOptions {
  elementRef: React.RefObject<HTMLElement>;
  fileName: string;
  twitterText: string;
  sectionName: string;
  sectionId: SectionId;
  onShowPreview: (previewData: SharePreviewData) => void;
}

export interface SharePreviewData {
  imageUrl: string;
  title: string;
  description: string;
  sectionName: string;
  sectionId: SectionId;
  fileName: string;
}

// Helper to convert dataURL to File object
async function dataURLtoFile(dataurl: string, filename: string): Promise<File> {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error("Invalid dataURL: MIME type not found");
  }
  const mime = mimeMatch[1];
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export const prepareSharePreview = async (options: ShareOptions): Promise<boolean> => {
  const { elementRef, fileName, twitterText, sectionName, sectionId, onShowPreview } = options;

  if (!elementRef.current) {
    alert("An unexpected error occurred: Element to capture not found.");
    console.error(`${sectionName} ref is not available`);
    return false;
  }

  try {
    const dataUrl = await toPng(elementRef.current, {
      cacheBust: true,
      backgroundColor: COLORS.neutral[950],
      pixelRatio: 2,
      quality: 1,
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
      },
      filter: (node) => {
        if (node instanceof HTMLElement) {
          return !node.classList.contains("no-capture");
        }
        return true;
      },
    });

    // Convert dataURL to File
    const imageFile = await dataURLtoFile(dataUrl, `${sectionId}.png`);

    // Prepare FormData for upload
    const formData = new FormData();
    formData.append("image", imageFile);

    // Get the upload token (ensure this is securely managed and available client-side)
    const uploadToken = process.env.NEXT_PUBLIC_UPLOAD_SECRET_TOKEN;
    if (!uploadToken) {
      console.error("Upload secret token is not configured. Set NEXT_PUBLIC_UPLOAD_SECRET_TOKEN.");
      alert("Share feature is not configured correctly (missing upload token).");
      return false;
    }

    // Upload the image
    const uploadResponse = await fetch(`/api/upload-og-image/${sectionId}`, {
      method: "POST",
      headers: {
        "X-Upload-Token": uploadToken,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorResult = await uploadResponse.json();
      console.error("Failed to upload share image:", errorResult);
      alert(`Failed to upload share image: ${errorResult.error || "Server error"}`);
      return false;
    }

    const uploadResult = await uploadResponse.json();
    const serverImageUrl = uploadResult.url;

    const previewData: SharePreviewData = {
      imageUrl: serverImageUrl,
      title: `Penumbra ${sectionName}`,
      description: twitterText,
      sectionName,
      sectionId,
      fileName,
    };

    onShowPreview(previewData);
    return true;
  } catch (err) {
    alert("An unexpected error occurred while preparing the share preview. Please try again.");
    console.error("Error in prepareSharePreview:", err);
    return false;
  }
};

export const shareToTwitter = async (previewData: SharePreviewData): Promise<boolean> => {
  const { description, sectionId } = previewData;
  const appBaseUrl =
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "https://penumbra.zone";

  let shareUrl = appBaseUrl;
  if (sectionId && sectionId !== SECTION_IDS.SUMMARY) {
    shareUrl = `${appBaseUrl}#${sectionId}`;
  }

  try {
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(description)}&url=${encodeURIComponent(shareUrl)}`;

    window.open(twitterIntentUrl, "_blank", "width=550,height=600,resizable=yes,scrollbars=yes");

    return true;
  } catch (err) {
    alert("An unexpected error occurred while trying to share to X. Please try again.");
    return false;
  }
};

// Type for each config entry in shareConfigs
interface ShareConfigEntry {
  id: SectionId; // The unique ID of the section
  fileName: string;
  twitterText: string;
  sectionName: string;
  sectionId: SectionId; // This is what gets passed to ShareOptions
}

// Predefined share configurations for different sections
export const shareConfigs: Record<SectionId, ShareConfigEntry> = {
  [SECTION_IDS.SUMMARY]: {
    id: SECTION_IDS.SUMMARY,
    fileName: "penumbra-summary",
    twitterText: "Check out the latest Penumbra tokenomics summary! 🌙📊 Key metrics at a glance",
    sectionName: "Summary",
    sectionId: SECTION_IDS.SUMMARY,
  },
  [SECTION_IDS.SUPPLY_VISUALIZATION]: {
    id: SECTION_IDS.SUPPLY_VISUALIZATION,
    fileName: "penumbra-supply",
    twitterText: "Penumbra token supply visualization 📈🔍 See how tokens are distributed",
    sectionName: "Supply Visualization",
    sectionId: SECTION_IDS.SUPPLY_VISUALIZATION,
  },
  [SECTION_IDS.BURN_METRICS]: {
    id: SECTION_IDS.BURN_METRICS,
    fileName: "penumbra-burn-metrics",
    twitterText: "Penumbra token burn metrics 🔥♻️ Deflationary mechanics in action",
    sectionName: "Burn Metrics",
    sectionId: SECTION_IDS.BURN_METRICS,
  },
  [SECTION_IDS.ISSUANCE_METRICS]: {
    id: SECTION_IDS.ISSUANCE_METRICS,
    fileName: "penumbra-issuance",
    twitterText: "Penumbra token issuance metrics 📊💎 New token creation insights",
    sectionName: "Issuance Metrics",
    sectionId: SECTION_IDS.ISSUANCE_METRICS,
  },
  [SECTION_IDS.TOKEN_DISTRIBUTION]: {
    id: SECTION_IDS.TOKEN_DISTRIBUTION,
    fileName: "penumbra-token-distribution",
    twitterText: "Understanding Penumbra\'s token distribution. 🥧",
    sectionName: "Token Distribution",
    sectionId: SECTION_IDS.TOKEN_DISTRIBUTION,
  },
  [SECTION_IDS.LQT]: {
    id: SECTION_IDS.LQT,
    fileName: "penumbra-lqt",
    twitterText: "Penumbra Liquidity Tournament stats 🏆🌊 Providing liquidity rewards",
    sectionName: "Liquidity Tournament",
    sectionId: SECTION_IDS.LQT,
  },
};
