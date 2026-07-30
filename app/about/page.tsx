import { Fragment } from "react";

import { AboutBio } from "@/components/AboutBio";
import { NavBar } from "@/components/NavBar";
import { TextLink } from "@/components/TextLink";
import { aboutCopy, socialLinks, user } from "@/content/user";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: aboutCopy.pageTitle,
  description: user.bio,
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
          <p className="text-base leading-relaxed text-foreground">
            {aboutCopy.socialsLeadIn}{" "}
            {socialLinks.map((social, index) => (
              <Fragment key={social.href}>
                {index > 0 && ", "}
                <TextLink href={social.href}>{social.label}</TextLink>
              </Fragment>
            ))}
            .
          </p>
          <p className="text-base leading-relaxed text-foreground">
            {aboutCopy.emailLeadIn}{" "}
            <TextLink href={`mailto:${user.email}`}>{user.email}</TextLink>.
          </p>
        </div>
      </section>
    </main>
  );
}
