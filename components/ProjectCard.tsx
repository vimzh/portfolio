import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { TextLink } from "@/components/TextLink";

import type { Project } from "@/types/data";

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <article className="group flex h-full flex-col gap-3 rounded-lg border bg-card p-5 transition-colors duration-200 hover:border-foreground/20 hover:bg-muted/40">
      <div className="flex items-start justify-between gap-3">
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-sm font-medium text-foreground outline-none focus-visible:underline focus-visible:underline-offset-4"
        >
          {project.title}
          <Icon
            icon={ArrowUpRight01Icon}
            aria-hidden="true"
            className="size-3.5 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          />
        </a>
        <span className="shrink-0 pt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
          {project.period}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="mt-auto flex flex-col gap-3 pt-1">
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

        {project.repo && (
          <TextLink href={project.repo} className="text-xs">
            source
          </TextLink>
        )}
      </div>
    </article>
  );
};
