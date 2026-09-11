import { getPublishedPosts } from "@/lib/blog";
import { routes } from "@/content/routes";
import { navigation, site } from "@/content/site";

import type { MetadataRoute } from "next";

export const revalidate = false;
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pageRoutes = navigation.map(({ href }) => href);
  const pages = pageRoutes.map((href) => ({
    url: new URL(href, site.url).toString(),
    changeFrequency: "monthly" as const,
    priority: href === routes.home ? 1 : 0.8,
  }));

  const posts = getPublishedPosts().map((post) => ({
    url: new URL(post.url, site.url).toString(),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...pages, ...posts];
}
