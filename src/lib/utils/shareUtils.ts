import { COLORS } from '@/common/helpers/colors';
import { toPng } from "html-to-image";

export interface ShareOptions {
  elementRef: React.RefObject<HTMLElement>;
  fileName: string;
  twitterText: string;
  sectionName: string;
  sectionId: string;
  onShowPreview: (previewData: SharePreviewData) => void;
}

export interface SharePreviewData {
  imageUrl: string;
  title: string;
  description: string;
  sectionName: string;
  sectionId: string;
  fileName: string;
  dataUrl: string; // Keep original for sharing
}

export const prepareSharePreview = async (options: ShareOptions): Promise<boolean> => {
  const { elementRef, fileName, twitterText, sectionName, sectionId, onShowPreview } = options;

  if (!elementRef.current) {
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

    const previewData: SharePreviewData = {
      imageUrl: dataUrl,
      title: `Penumbra ${sectionName}`,
      description: twitterText,
      sectionName,
      sectionId,
      fileName,
      dataUrl,
    };

    onShowPreview(previewData);
    return true;

  } catch (err) {
    alert('An unexpected error occurred while trying to share to X. Please try again.');
    console.error(err);
    return false;
  }
};

export const shareToTwitter = async (previewData: SharePreviewData): Promise<boolean> => {
  const { description, sectionId } = previewData;
  // Dynamically get the current page's base URL
  const appBaseUrl = typeof window !== "undefined" 
    ? window.location.origin + window.location.pathname 
    : "https://penumbra.zone"; // Fallback for non-browser environments (though unlikely for this function)

  let shareUrl = appBaseUrl;
  if (sectionId && sectionId !== "summary") {
    shareUrl = `${appBaseUrl}#${sectionId}`; // Note: No slash before # for fragments
  }

  try {
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(description)}&url=${encodeURIComponent(shareUrl)}`;
    
    window.open(twitterIntentUrl, '_blank', 'width=550,height=600,resizable=yes,scrollbars=yes');

    return true;

  } catch (err) {
    alert('An unexpected error occurred while trying to share to X. Please try again.');
    return false;
  }
};

// Predefined share configurations for different sections
export const shareConfigs = {
  summary: {
    id: "summary",
    fileName: "penumbra-summary",
    twitterText: "Check out the latest Penumbra tokenomics summary! 🌙📊 Key metrics at a glance",
    sectionName: "Summary",
  },
  supply: {
    id: "supply-visualization",
    fileName: "penumbra-supply",
    twitterText: "Penumbra token supply visualization 📈🔍 See how tokens are distributed",
    sectionName: "Supply Visualization",
  },
  burn: {
    id: "burn-metrics",
    fileName: "penumbra-burn-metrics",
    twitterText: "Penumbra token burn metrics 🔥♻️ Deflationary mechanics in action",
    sectionName: "Burn Metrics",
  },
  issuance: {
    id: "issuance-metrics",
    fileName: "penumbra-issuance",
    twitterText: "Penumbra token issuance metrics 📊💎 New token creation insights",
    sectionName: "Issuance Metrics",
  },
  lqt: {
    id: "lqt",
    fileName: "penumbra-lqt",
    twitterText: "Penumbra Liquidity Tournament stats 🏆🌊 Providing liquidity rewards",
    sectionName: "Liquidity Tournament",
  },
}; 