import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";

import { Icon } from "@/components/Icon";

import type { Project } from "@/types/portfolio";

type ProjectCardProps = {
  project: Project;
  eager?: boolean;
};

export const ProjectCard = ({ project, eager = false }: ProjectCardProps) => {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-colors duration-200 hover:border-foreground/20">
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative mx-[9px] mt-[9px] block aspect-video overflow-hidden rounded-[calc(var(--radius)-0.25rem)] border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(max-width: 640px) calc(100vw - 3rem), 352px"
          className="object-cover object-top"
        />
      </a>

      <div className="flex flex-1 flex-col gap-3 p-[13px]">
        <a
          href={project.repo ?? project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1 rounded-sm font-medium text-foreground outline-none focus-visible:underline focus-visible:underline-offset-4"
        >
          {project.title}
          <Icon
            icon={ArrowUpRight01Icon}
            aria-hidden="true"
            className="size-3.5 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          />
        </a>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-auto pt-1">
          <ul className="flex flex-wrap items-center gap-1.5">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
};
