import { COLORS } from "@/common/helpers/colors";
import { SECTION_IDS } from "@/lib/types/sections";
import { ShareOptions, SharePreviewData } from "@/lib/utils/types";
import { toPng } from "html-to-image";


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
  const { elementRef, shareConfig, onShowPreview } = options;
  const { fileName, description, title, sectionName, sectionId } = shareConfig;

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

    // Upload the image
    const uploadResponse = await fetch(`/api/upload-og-image/${sectionId}`, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      return false;
    }

    const uploadResult = await uploadResponse.json();
    const serverImageUrl = uploadResult.url;

    const previewData: SharePreviewData = {
      imageUrl: serverImageUrl,
      title,
      description,
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