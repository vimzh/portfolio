import { TextLink } from "@/components/TextLink";
import { footerLinks, profile } from "@/lib/data";

export const Footer = () => {
  return (
    <footer className="flex w-full flex-wrap items-center justify-between gap-4 pt-10 pb-6 text-sm text-muted-foreground">
      <p>
        built with love by <TextLink href={profile.handleUrl}>vimzh</TextLink>
      </p>
      <div className="flex items-center gap-5">
        {footerLinks.map((link) => (
          <TextLink key={link.href} href={link.href}>
            {link.label}
          </TextLink>
        ))}
      </div>
    </footer>
  );
};
