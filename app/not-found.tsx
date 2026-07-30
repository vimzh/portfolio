import { NavBar } from "@/components/NavBar";
import { TextLink } from "@/components/TextLink";
import { routes } from "@/content/routes";
import { notFoundCopy } from "@/content/site";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: notFoundCopy.metadataTitle,
};

export default function NotFound() {
  return (
    <main className="reveal-stack flex flex-1 flex-col pt-24">
      <div className="flex w-full flex-col gap-6">
        <NavBar />
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {notFoundCopy.heading}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          {notFoundCopy.message}{" "}
          <TextLink href={routes.home}>{notFoundCopy.homeLabel}</TextLink>.
        </p>
      </div>
    </main>
  );
}
