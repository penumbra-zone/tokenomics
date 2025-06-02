import { SECTION_IDS, SectionId } from "@/lib/types/sections";
import Dashboard from "@/modules/tokenomics/views/Dashboard";

export const generateMetadata = async ({ params }: { params: { section: SectionId } }) => {
  const section = params.section ?? SECTION_IDS.SUMMARY;
  const imageUrl = `/api/share/${section}`;
  const ogImageUrl = new URL(imageUrl, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");

  return {
    other: {
      "og:title": "Penumbra Tokenomics",
      "og:description": "Penumbra Tokenomics",

      // standard apps, slack, etc.
      "og:image": `${ogImageUrl.href}`,
      "og:image:height": 1200,
      "og:image:width": 630,

      // twitter
      "twitter:card": "summary_large_image",
      "twitter:image": `${ogImageUrl.href}`,
      "twitter:image:height": 1200,
      "twitter:image:width": 630,
    },
  };
};

export default function Home() {
  return <Dashboard />;
}
