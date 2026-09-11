import { NavBar } from "@/components/NavBar";
import { Projects } from "@/components/Projects";
import { projectsCopy } from "@/content/projects";

import { routes } from "@/content/routes";
import { site, socialMetadata } from "@/content/site";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: projectsCopy.heading,
  description: projectsCopy.description,
  alternates: { canonical: routes.projects },
  openGraph: {
    ...socialMetadata.openGraph,
    url: routes.projects,
    title: `${projectsCopy.heading} · ${site.name}`,
    description: projectsCopy.description,
  },
  twitter: {
    ...socialMetadata.twitter,
    title: `${projectsCopy.heading} · ${site.name}`,
    description: projectsCopy.description,
  },
};

export default function ProjectsPage() {
  return (
    <main className="reveal-stack flex flex-1 flex-col gap-16 pt-24">
      <NavBar />
      <Projects />
    </main>
  );
}
