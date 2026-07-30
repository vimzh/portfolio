import type { Routes } from "@/types/data";

export const routes = {
  home: "/",
  about: "/about",
  projects: "/projects",
  blogs: "/blogs",
  resume: "/resume.pdf",
  aboutMarkdown: "/about.md",
  workMarkdown: "/work.md",
  llms: "/llms.txt",
  sitemap: "/sitemap.xml",
} as const satisfies Routes;
