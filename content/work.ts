import type { WorkEntry } from "@/types/profile";

export const workCopy = {
  heading: "work",
} as const;

export const work = [
  {
    company: "ArtifexOne",
    role: "AI Engineer",
    period: "Feb 2026 – May 2026",
    isPrivate: false,
  },
  {
    company: "Astroraag",
    role: "Software Intern",
    period: "Feb 2026 – Jun 2026",
    isPrivate: false,
  },
  {
    company: "Stealth",
    role: "Founding Backend Engineer",
    period: "Aug 2025 – Apr 2026",
    isPrivate: true,
  },
] as const satisfies readonly WorkEntry[];
