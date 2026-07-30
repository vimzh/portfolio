export type Link = {
  label: string;
  href: string;
};

export type UserAccount = Link & {
  username: string;
  handle?: string;
};

export type User = {
  name: string;
  alias: string;
  email: string;
  bio: string;
  avatars: readonly string[];
  accounts: {
    github: UserAccount;
    x: UserAccount;
    linkedin: UserAccount;
    codeforces: UserAccount;
    leetcode: UserAccount;
  };
};

export type AboutCopy = {
  greeting: string;
  aliasConnector: string;
  socialsLeadIn: string;
};

export type WorkEntry = {
  company: string;
  role: string;
  period: string;
  isPrivate?: boolean;
};

export type Project = {
  title: string;
  description: string;
  period?: string;
  tags: string[];
  image: string;
  imageAlt: string;
  link: string;
  repo?: string;
};

export type Contribution = {
  owner: string;
  repo: string;
  stars: string;
  description: string;
  status: string;
  link: string;
};

export type Site = {
  name: string;
  title: string;
  description: string;
  url: string;
  keywords: readonly string[];
};

export type Routes = {
  home: string;
  projects: string;
  blogs: string;
  resume: string;
  aboutMarkdown: string;
  workMarkdown: string;
  llms: string;
  sitemap: string;
};
