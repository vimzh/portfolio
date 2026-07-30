import type { Project } from "@/types/portfolio";

export const projectsCopy = {
  heading: "projects",
  moreLabel: "more",
  seeAllLabel: "see all",
} as const;

export const projects = [
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
] as const satisfies readonly Project[];
