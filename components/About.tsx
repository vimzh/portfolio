import { Fragment } from "react";

import { Avatar } from "@/components/Avatar";
import { NavBar } from "@/components/NavBar";
import { TextLink } from "@/components/TextLink";
import { profile, socials } from "@/lib/data";

export const About = () => {
  return (
    <section className="flex w-full flex-col items-start gap-8">
      <Avatar images={profile.avatars} alt={`${profile.name}'s avatar`} />
      <div className="flex w-full flex-col gap-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          hi i’m {profile.name} aka{" "}
          <TextLink href={profile.handleUrl}>{profile.handle}</TextLink>
        </h1>
        <NavBar />
        <p className="text-base leading-relaxed text-foreground">
          {profile.bio}
        </p>
        <p className="text-base leading-relaxed text-foreground">
          you can find me on{" "}
          {socials.map((social, index) => (
            <Fragment key={social.href}>
              {index > 0 && ", "}
              <TextLink href={social.href}>{social.label}</TextLink>
            </Fragment>
          ))}
          .
        </p>
      </div>
    </section>
  );
};
