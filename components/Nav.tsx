import { TextLink } from "@/components/TextLink";
import { navigation } from "@/content/site";

export const Nav = () => {
  return (
    <nav className="flex gap-5 text-sm">
      {navigation.map((item) => (
        <TextLink key={item.href} href={item.href}>
          {item.label}
        </TextLink>
      ))}
    </nav>
  );
};
