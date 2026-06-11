import { NavBar } from "@/components/NavBar";
import { TextLink } from "@/components/TextLink";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "page not found",
};

export default function NotFound() {
  return (
    <main className="reveal-stack flex flex-1 flex-col pt-24">
      <div className="flex w-full flex-col gap-6">
        <NavBar />
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          404, page not found
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          this page doesn’t exist or has moved. head back{" "}
          <TextLink href="/">home</TextLink>.
        </p>
      </div>
    </main>
  );
}
