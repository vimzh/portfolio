import { NavBar } from "@/components/NavBar";
import { Projects } from "@/components/Projects";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "projects",
};

export default function ProjectsPage() {
  return (
    <main className="reveal-stack flex flex-1 flex-col gap-16 pt-24">
      <NavBar />
      <Projects />
    </main>
  );
}
