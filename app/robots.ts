import { routes } from "@/content/routes";
import { site } from "@/content/site";

import type { MetadataRoute } from "next";

export const revalidate = false;
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: routes.home,
    },
    sitemap: new URL(routes.sitemap, site.url).toString(),
    host: site.url,
  };
}
