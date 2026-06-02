import { About } from "@/components/About";
import { Contributions } from "@/components/Contributions";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <main className="reveal-stack flex flex-1 flex-col gap-16 pt-24">
      <About />
      <Work />
      <Contributions />
    </main>
  );
}
