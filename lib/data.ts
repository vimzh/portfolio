import type { Project } from "@/types/data";

export const profile = {
  avatars: ["/avatar.jpeg", "/avatar-2.jpeg", "/avatar-3.jpeg"],
  name: "vansh",
  handle: "@vimzh",
  handleUrl: "https://x.com/vimzhtwt",
  githubUsername: "vimzh",
  email: "vimzh.dev@gmail.com",
  bio: "I’m a full-stack developer obsessed with AI and clean, minimal interfaces. I love building things from scratch, figuring out hard problems and shipping fast. Most of my time goes into writing code, contributing to open source and exploring what’s possible with LLMs. Always open to interesting projects and collaborations. If you’re working on something cool, let’s talk.",
};

export const socials = [
  { label: "github", href: "https://github.com/vimzh" },
  { label: "x", href: "https://x.com/vimzhtwt" },
  { label: "linkedin", href: "https://www.linkedin.com/in/vimzh/" },
  { label: "codeforces", href: "https://codeforces.com/profile/tzyx" },
  { label: "leetcode", href: "https://leetcode.com/u/vimzh" },
];

export const nav = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "Components", href: "/components" },
];

export const work = [
  {
    company: "ArtifexOne",
    role: "AI Engineer",
    period: "Feb 2026 – Present",
  },
  {
    company: "Astroraag",
    role: "Software Intern",
    period: "Feb 2025 – Jun 2025",
  },
  {
    company: "Stealth",
    role: "Founding Backend Engineer",
    period: "Aug 2025 – Apr 2026",
  },
];


// Placeholder projects. Replace the copy, links, and tags with real work.
export const projects: Project[] = [
  {
    title: "Jottr",
    description:
      "Open-source note-taking app with AI-powered search and summarization.",
    tags: ["TypeScript", "Next.js", "convex", "Vercel"],
    link: "https://github.com/vimzh/jottr",
    repo: "https://github.com/vimzh/jottr",
  },
  {
    title: "Quill",
    description:
      "A minimal markdown editor with local-first sync and a command palette, built for fast daily notes.",
    period: "2025",
    tags: ["Next.js", "tRPC", "SQLite"],
    link: "https://github.com/vimzh/quill",
    repo: "https://github.com/vimzh/quill",
  },
  {
    title: "Drift",
    description:
      "A realtime collaborative whiteboard with CRDT state and presence, no backend lock-in.",
    period: "2025",
    tags: ["React", "Yjs", "WebRTC"],
    link: "https://github.com/vimzh/drift",
    repo: "https://github.com/vimzh/drift",
  },
  {
    title: "ctx",
    description:
      "A CLI that packs a repository into an LLM-ready context bundle with token-aware trimming.",
    period: "2024",
    tags: ["Go", "Tree-sitter"],
    link: "https://github.com/vimzh/ctx",
  },
];

export type Contribution = {
  owner: string;
  repo: string;
  stars: string;
  description: string;
  status: string;
  link: string;
};

// Open-source contributions. `link` points at each repo for now; swap it for the
// specific PR URL when you have it.
export const openSource: Contribution[] = [
  {
    owner: "fb55",
    repo: "htmlparser2",
    stars: "4.8k",
    description:
      "Add WebWritableStream for Web Streams API support, enabling piping fetch() responses directly into the parser",
    status: "Merged",
    link: "https://github.com/fb55/htmlparser2",
  },
  {
    owner: "inokawa",
    repo: "virtua",
    stars: "3.5k",
    description:
      "Add Base UI ScrollArea story for virtualized scrolling with custom scrollbars",
    status: "Merged",
    link: "https://github.com/inokawa/virtua",
  },
  {
    owner: "aymericzip",
    repo: "intlayer",
    stars: "636",
    description:
      "Replace native textarea with contentEditable div for inline autocomplete ghost text rendering",
    status: "Merged",
    link: "https://github.com/aymericzip/intlayer",
  },
];

// Smaller contributions shown as a compact overflow line under the detailed
// list above. Verify each link points where you want.
export const moreContributions = [
  { name: "supermemory", link: "https://github.com/supermemoryai/supermemory" },
  { name: "kandev", link: "https://github.com/kandev" },
  { name: "payloadcms", link: "https://github.com/payloadcms/payload" },
];

export const site = {
  name: "vansh",
  title: "vansh, full-stack developer",
  description:
    "Full-stack developer obsessed with AI and clean, minimal interfaces. Building from scratch, contributing to open source and exploring what's possible with LLMs.",
  url: "https://vimzh.dev",
  keywords: [
    "vansh",
    "vimzh",
    "full-stack developer",
    "AI engineer",
    "software engineer",
    "open source",
    "LLMs",
    "web developer",
    "portfolio",
  ],
};

// Browser chrome (meta theme-color) values, kept in sync with the --background
// token in globals.css for light and dark.
export const metaThemeColors = {
  light: "#fafafa",
  dark: "#1c1c1c",
};

export const emptyState = "Nothing here yet. Check back soon.";

// Pastel selection-highlight hues (oklch), cycled on each text selection.
export const selectionHues = [266, 95, 160, 350, 230, 50]; // purple, yellow, mint, pink, blue, peach
