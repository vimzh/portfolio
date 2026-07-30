import { blogPosts } from "collections/server";
import { format, parseISO } from "date-fns";
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

import { routes } from "@/content/routes";

export const blog = loader({
  baseUrl: routes.blogs,
  source: toFumadocsSource(blogPosts, []),
});

export type BlogPost = typeof blog.$inferPage;

export const getBlogPostSlug = (post: BlogPost) => {
  const [slug, ...nestedSlugs] = post.slugs;

  if (!slug || nestedSlugs.length > 0) {
    throw new Error(`Blog posts must use one flat slug: ${post.path}`);
  }

  return slug;
};

export const getPublishedPosts = () =>
  blog
    .getPages()
    .filter((post) => post.data.published)
    .toSorted((a, b) => b.data.date.localeCompare(a.data.date));

export const getPublishedPost = (slug: string) => {
  const post = blog.getPage([slug]);
  return post?.data.published ? post : undefined;
};

export const formatBlogDate = (date: string) =>
  format(parseISO(date), "MMM d, yyyy");
