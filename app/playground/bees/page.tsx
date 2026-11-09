import { BeePlayground } from "@/components/bees/BeePlayground";
import { NavBar } from "@/components/NavBar";
import { beesCopy } from "@/content/bees";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: beesCopy.heading,
  description: beesCopy.description,
  robots: { index: false, follow: false },
};

export default function BeesPage() {
  return (
    <main className="flex flex-1 flex-col gap-10 pt-24">
      <NavBar />
      <header className="space-y-3">
        <h1 className="font-heading text-4xl text-foreground">
          {beesCopy.heading}
        </h1>
        <p className="max-w-lg text-[15px] leading-relaxed text-muted-foreground">
          {beesCopy.description}
        </p>
      </header>
      <BeePlayground />
    </main>
  );
}
