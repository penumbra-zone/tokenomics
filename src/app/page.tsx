import { env as serverEnv } from "@/lib/env/server";
import { SECTION_IDS, SectionId } from "@/lib/types/sections";
import Dashboard from "@/modules/tokenomics/views/Dashboard";

export const generateMetadata = async ({ params }: { params: { section: SectionId } }) => {
  const section = params.section ?? SECTION_IDS.SUMMARY;
  const imageUrl = `/api/share/${section}`;

  const siteUrl = serverEnv.BASE_URL;
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
