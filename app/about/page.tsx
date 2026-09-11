import { Fragment } from "react";

import { AboutBio } from "@/components/AboutBio";
import { NavBar } from "@/components/NavBar";
import { TextLink } from "@/components/TextLink";
import { aboutCopy, socialLinks, user } from "@/content/user";

import { routes } from "@/content/routes";
import { site, socialMetadata } from "@/content/site";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: aboutCopy.pageTitle,
  description: user.bio,
  alternates: { canonical: routes.about },
  openGraph: {
    ...socialMetadata.openGraph,
    url: routes.about,
    title: `${aboutCopy.pageTitle} · ${site.name}`,
    description: user.bio,
  },
  twitter: {
    ...socialMetadata.twitter,
    title: `${aboutCopy.pageTitle} · ${site.name}`,
    description: user.bio,
  },
};

export default function AboutPage() {
  return (
    <main className="reveal-stack flex flex-1 flex-col gap-16 pt-24">
      <NavBar />
      <section className="flex w-full flex-col gap-8">
        <h1 className="font-heading text-xl font-normal tracking-tight text-foreground">
          {aboutCopy.pageTitle}
        </h1>
        <div className="flex flex-col gap-6">
          <AboutBio />
          <p className="text-[15px] leading-relaxed text-foreground">
            {aboutCopy.socialsLeadIn}{" "}
            {socialLinks.map((social, index) => (
              <Fragment key={social.href}>
                {index > 0 && ", "}
                <TextLink href={social.href}>{social.label}</TextLink>
              </Fragment>
            ))}
            .
          </p>
          <p className="text-[15px] leading-relaxed text-foreground">
            {aboutCopy.emailLeadIn}{" "}
            <TextLink href={`mailto:${user.email}`}>{user.email}</TextLink>.
          </p>
        </div>
      </section>
    </main>
  );
}
