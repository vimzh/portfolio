export type Site = {
  name: string;
  title: string;
  description: string;
  url: string;
  keywords: readonly string[];
};

export type Routes = {
  home: string;
  about: string;
  projects: string;
  blogs: string;
  resume: string;
  aboutMarkdown: string;
  workMarkdown: string;
  llms: string;
  sitemap: string;
};
