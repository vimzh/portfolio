import type { Routes } from "@/types/data";

export const routes = {
  home: "/",
  projects: "/projects",
  blogs: "/blogs",
  resume: "/resume.pdf",
  aboutMarkdown: "/about.md",
  workMarkdown: "/work.md",
  llms: "/llms.txt",
  sitemap: "/sitemap.xml",
} as const satisfies Routes;
