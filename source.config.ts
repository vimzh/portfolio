import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";

export const blogPosts = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.iso.date(),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(true),
  }),
});

export default defineConfig();
