import { About } from "@/components/About";
import { Contributions } from "@/components/Contributions";
import { OpenSource } from "@/components/OpenSource";
import { Projects } from "@/components/Projects";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <main className="reveal-stack flex flex-1 flex-col gap-16 pt-24">
      <About />
      <Work />
      <Projects featured />
      <Contributions />
      <OpenSource />
    </main>
  );
}
