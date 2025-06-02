import { env as serverEnv } from "@/lib/env/server";
import { SECTION_IDS, SectionId } from "@/lib/types/sections";
import { shareConfigs } from "@/lib/utils/types";
import Dashboard from "@/modules/tokenomics/views/Dashboard";

export const generateMetadata = async ({ params }: { params: { section: SectionId } }) => {
  const section = params.section ?? SECTION_IDS.SUMMARY;
  const imageUrl = `/api/share/${section}`;

  const siteUrl = serverEnv.BASE_URL;
  const ogImageUrl = new URL(imageUrl, siteUrl);

  const { title, description } = shareConfigs[section as SectionId];

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    other: {
      "og:title": title,
      "og:description": description,
      "og:image": `${ogImageUrl.pathname}`,
      "og:image:height": 1200,
      "og:image:width": 630,
      "twitter:title": title,
      "twitter:description": description,
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
