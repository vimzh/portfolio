import { site } from "@/lib/data";

import type { MetadataRoute } from "next";

export const revalidate = false;
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
