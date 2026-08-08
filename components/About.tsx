import { Fragment } from "react";

import { AboutBio } from "@/components/AboutBio";
import { NavBar } from "@/components/NavBar";
import { TextLink } from "@/components/TextLink";
import { aboutCopy, socialLinks, user } from "@/content/user";

export const About = () => {
  return (
    <section className="flex w-full flex-col items-start gap-8">
      <div className="flex w-full flex-col gap-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {aboutCopy.greeting} {user.name} {aboutCopy.aliasConnector}{" "}
          <TextLink href={user.accounts.x.href}>
            {user.accounts.x.handle}
          </TextLink>
        </h1>
        <NavBar />
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
  );
};
