"use client";

import { useState } from "react";
import Link from "next/link";

import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/data";

const PROJECTS_PER_PAGE = 4;

type ProjectsProps = {
  featured?: boolean;
};

export const Projects = ({ featured = false }: ProjectsProps) => {
  const [visibleCount, setVisibleCount] = useState(
    featured ? 2 : PROJECTS_PER_PAGE,
  );
  const visibleProjects = projects.slice(0, visibleCount);
  const hasMoreProjects = !featured && visibleCount < projects.length;

  return (
    <section className="flex w-full flex-col gap-6">
      <h2 className="font-heading text-xl font-normal tracking-tight text-foreground">
        projects
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visibleProjects.map((project, index) => (
          <ProjectCard key={project.title} project={project} eager={index < 2} />
        ))}
      </div>
      {hasMoreProjects && (
        <button
          type="button"
          aria-label="Show more projects"
          className="self-center rounded-sm text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:outline-none"
          onClick={() => setVisibleCount((count) => count + PROJECTS_PER_PAGE)}
        >
          more
        </button>
      )}
      {featured && projects.length > 2 && (
        <Link
          href="/projects"
          className="self-center rounded-sm text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:outline-none"
        >
          see all
        </Link>
      )}
    </section>
  );
};
