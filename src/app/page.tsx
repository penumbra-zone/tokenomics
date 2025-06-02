import { env as serverEnv } from "@/lib/env/server";
import { SECTION_IDS, SectionId } from "@/lib/types/sections";
import Dashboard from "@/modules/tokenomics/views/Dashboard";

export const generateMetadata = async ({ params }: { params: { section: SectionId } }) => {
  const section = params.section ?? SECTION_IDS.SUMMARY;
  const imageUrl = `/api/share/${section}`;

  let siteUrl;
  if (process.env.VERCEL_URL) {
    // Prepend https and remove trailing slash if VERCEL_URL has one (it usually doesn't)
    siteUrl = `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  } else if (serverEnv.NEXT_PUBLIC_SITE_URL) {
    siteUrl = serverEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  } else {
    siteUrl = "http://localhost:3000";
  }

  const ogImageUrl = new URL(imageUrl, siteUrl);

  return {
    // To make it easier to see which URL is being used in <head>
    metadataBase: new URL(siteUrl),
    title: "Penumbra Tokenomics Dashboard",
    description: "A comprehensive dashboard for token metrics and distribution",
    other: {
      "og:title": "Penumbra Tokenomics",
      "og:description": "Penumbra Tokenomics",
      "og:image": `${ogImageUrl.pathname}`,
      "og:image:height": 1200,
      "og:image:width": 630,
      "twitter:title": "Penumbra Tokenomics",
      "twitter:description": "Penumbra Tokenomics",
      "twitter:card": "summary_large_image",
      "twitter:image": `${ogImageUrl.pathname}`,
      "twitter:image:height": 1200,
      "twitter:image:width": 630,
    },
  };
};

export default function Home() {
  return <Dashboard />;
}
