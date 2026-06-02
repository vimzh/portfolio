import { nav, site } from "@/lib/data";

import type { MetadataRoute } from "next";

export const revalidate = false;
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return nav.map(({ href }) => ({
    url: new URL(href, site.url).toString(),
    lastModified,
    changeFrequency: "monthly",
    priority: href === "/" ? 1 : 0.8,
  }));
}
