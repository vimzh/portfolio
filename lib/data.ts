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

export const footerLinks = [
  { label: "github", href: `https://github.com/${profile.githubUsername}` },
  { label: "email", href: `mailto:${profile.email}` },
  { label: "resume", href: "/resume.pdf" },
];

export const blogCopy = {
  title: "blogs",
  description: "Notes on agentic engineering, software, and building products.",
  backLabel: "back to blogs",
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
];

export const work = [
  {
    company: "ArtifexOne",
    role: "AI Engineer",
    period: "Feb 2026 – May 2026",
  },
  {
    company: "Astroraag",
    role: "Software Intern",
    period: "Feb 2026 – Jun 2026",
  },
  {
    company: "Stealth",
    role: "Founding Backend Engineer",
    period: "Aug 2025 – Apr 2026",
  },
];

export const projects: Project[] = [
  {
    title: "Jottr",
    description:
      "A real-time, end-to-end encrypted note-taking app built for fast capture and private syncing.",
    period: "2025",
    tags: ["Next.js", "TypeScript", "Convex"],
    image: "/projects/jottr.png",
    imageAlt: "Jottr note-taking app landing page",
    link: "https://tempori.kymi.dev/",
    repo: "https://github.com/vimzh/jottr",
  },
  {
    title: "nom.ai",
    description:
      "A codebase agent that connects repository context, conversations, and tasks to help teams understand and ship software.",
    period: "2025",
    tags: ["Next.js", "AI SDK", "LangChain", "Prisma"],
    image: "/projects/nom-ai.png",
    imageAlt: "nom.ai codebase agent landing page",
    link: "https://nom-ai.vercel.app/",
    repo: "https://github.com/vimzh/nom.ai",
  },
  {
    title: "plob.dev",
    description:
      "A developer-first profile platform with links, blogging, product showcases, wildcard subdomains, and built-in analytics.",
    period: "2026",
    tags: ["Next.js", "PostgreSQL", "Drizzle", "Lucia"],
    image: "/projects/plob.png",
    imageAlt: "plob.dev profile platform landing page",
    link: "https://plob.dev/",
    repo: "https://github.com/vimzh/plob.dev",
  },
  {
    title: "Dambo",
    description:
      "An AI-assisted data workspace for exploring datasets, refining visualizations, and exporting polished reports.",
    period: "2026",
    tags: ["Next.js", "Tambo", "Recharts", "Gemini"],
    image: "/projects/dambo.png",
    imageAlt: "Dambo real-time data visualization landing page",
    link: "https://dambo-ai.vercel.app/",
    repo: "https://github.com/vimzh/dambo",
  },
  {
    title: "Fiebatt",
    description:
      "A prompt-driven video editor for precise, localized changes with timeline-aware planning, variant review, and export.",
    period: "2026",
    tags: ["Next.js", "FastAPI", "Qwen", "SAM2"],
    image: "/projects/fiebatt.png",
    imageAlt: "Fiebatt prompt-driven video editor landing page",
    link: "https://github.com/ASAC44/fiebatt",
    repo: "https://github.com/ASAC44/fiebatt",
  },
  {
    title: "Argus",
    description:
      "Persistent research agents that monitor changing topics, verify evidence, and maintain a traceable living database.",
    period: "2026",
    tags: ["Next.js", "Hono", "BullMQ", "SigNoz"],
    image: "/projects/argus.png",
    imageAlt: "Argus persistent research agent landing page",
    link: "https://github.com/ASAC44/argus",
    repo: "https://github.com/ASAC44/argus",
  },
  {
    title: "Cloudy",
    description:
      "An AI keychain companion for reviewing and approving important agent actions from a Raspberry Pi-powered pod.",
    period: "2026",
    tags: ["Next.js", "Hono", "Supabase", "Raspberry Pi"],
    image: "/projects/cloudy.png",
    imageAlt: "Cloudy agent approval companion landing page",
    link: "https://github.com/ASAC44/cloudy",
    repo: "https://github.com/ASAC44/cloudy",
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
