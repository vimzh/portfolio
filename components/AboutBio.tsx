import { TextLink } from "@/components/TextLink";
import { bioCopy, user } from "@/content/user";

export const AboutBio = () => (
  <p className="text-[15px] leading-relaxed text-foreground">
    {bioCopy.summary} {bioCopy.contactLeadIn}{" "}
    <TextLink href={`mailto:${user.email}`}>{bioCopy.contactLabel}</TextLink>
  </p>
);
