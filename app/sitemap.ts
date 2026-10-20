import type { MetadataRoute } from "next";
import { LEGAL_SLUGS } from "@/components/legal/registry";
import { SITE_URL } from "@/lib/site";

// sitemap.xml: public pages offered to search engines. Add every new public
// page here. See docs/features/seo.md.
const SITEMAP_PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/contact", priority: 0.5 },
  ...LEGAL_SLUGS.map((slug) => ({ path: `/${slug}`, priority: 0.2 })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_PAGES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    priority,
  }));
}
