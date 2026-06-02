import { TextLink } from "@/components/TextLink";
import { profile } from "@/lib/data";

export const Footer = () => {
  const githubUrl = `https://github.com/${profile.githubUsername}`;

  return (
    <footer className="flex w-full flex-wrap items-center justify-between gap-4 py-10 text-sm text-muted-foreground">
      <p>
        built with love by <TextLink href={profile.handleUrl}>vimzh</TextLink>
      </p>
      <div className="flex items-center gap-5">
        <TextLink href={githubUrl}>github</TextLink>
        <TextLink href={`mailto:${profile.email}`}>email</TextLink>
      </div>
    </footer>
  );
};
