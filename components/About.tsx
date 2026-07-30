import { Fragment } from "react";
import Link from "next/link";

import { Avatar } from "@/components/Avatar";
import { AboutBio } from "@/components/AboutBio";
import { NavBar } from "@/components/NavBar";
import { TextLink } from "@/components/TextLink";
import { routes } from "@/content/routes";
import { aboutCopy, socialLinks, user } from "@/content/user";

export const About = () => {
  return (
    <section className="flex w-full flex-col items-start gap-8">
      <Avatar images={user.avatars} alt={`${user.name}'s avatar`} />
      <div className="flex w-full flex-col gap-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {aboutCopy.greeting} {user.name} {aboutCopy.aliasConnector}{" "}
          <TextLink href={user.accounts.x.href}>
            {user.accounts.x.handle}
          </TextLink>
        </h1>
        <NavBar />
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
        <Link
          href={routes.about}
          className="self-center rounded-sm text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:outline-none"
        >
          {aboutCopy.moreLabel}
        </Link>
      </div>
    </section>
  );
};
