import { routes } from "@/content/routes";
import { user } from "@/content/user";

import type { Link } from "@/types/common";
import type { Site } from "@/types/site";

export const site = {
  name: `${user.name} (${user.alias})`,
  browserTitle: `${user.name} (${user.alias}) | Full-stack Developer`,
  title: `${user.name} (${user.alias}) | Full-stack Developer`,
  description:
    `${user.name}, also known as ${user.alias}, is a full-stack developer obsessed with AI and clean, minimal interfaces. Building from scratch, contributing to open source and exploring what's possible with LLMs.`,
  url: "https://www.vimzh.dev",
  keywords: [
    user.name,
    user.alias,
    "full-stack developer",
    "AI engineer",
    "software engineer",
    "open source",
    "LLMs",
    "web developer",
    "portfolio",
  ],
} as const satisfies Site;

export const navigation = [
  { label: "Home", href: routes.home },
  { label: "About", href: routes.about },
  { label: "Projects", href: routes.projects },
  { label: "Blogs", href: routes.blogs },
] as const satisfies readonly Link[];

export const footerLinks = [
  { label: "llms.txt", href: routes.llms },
  { label: "github", href: user.accounts.github.href },
  { label: "resume", href: routes.resume },
] as const satisfies readonly Link[];

export const footerAction = {
  label: "let’s talk",
  href: `mailto:${user.email}`,
} as const satisfies Link;

export const footerCopy = {
  prefix: "built with love by",
} as const;

export const notFoundCopy = {
  metadataTitle: "page not found",
  heading: "404, page not found",
  message: "this page doesn’t exist or has moved. head back",
  homeLabel: "home",
} as const;

export const llmsCopy = {
  index: {
    aboutLabel: "About",
    aboutDescription:
      "A quick intro to me, how to reach me, and where to find me online.",
    workLabel: "Work",
    workDescription: "Roles I've held and where I'm working now.",
    linksHeading: "Links",
  },
  about: {
    title: "About",
    contactHeading: "Contact",
    nameLabel: "Name",
    handleLabel: "Handle",
    emailLabel: "Email",
    websiteLabel: "Website",
    socialLinksHeading: "Social Links",
  },
  work: {
    title: "Work",
  },
} as const;

export const socialImage = {
  url: "/social-preview.png",
  width: 1200,
  height: 630,
  alt: `${user.name} (${user.alias}), full-stack developer`,
};

export const socialMetadata = {
  openGraph: {
    type: "website" as const,
    siteName: `${user.name} (${user.alias})`,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image" as const,
    creator: user.accounts.x.handle,
    images: [socialImage],
  },
};
