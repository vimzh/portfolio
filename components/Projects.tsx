import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/data";

export const Projects = () => {
  return (
    <section className="flex w-full flex-col gap-6">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        projects
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
};
