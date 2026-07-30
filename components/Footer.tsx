import { TextLink } from "@/components/TextLink";
import { footerCopy, footerLinks } from "@/content/site";
import { user } from "@/content/user";

export const Footer = () => {
  return (
    <footer className="flex w-full flex-wrap items-center justify-between gap-4 pt-10 pb-6 text-sm text-muted-foreground">
      <p>
        {footerCopy.prefix}{" "}
        <TextLink href={user.accounts.x.href}>{user.alias}</TextLink>
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
