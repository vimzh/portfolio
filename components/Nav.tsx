import { TextLink } from "@/components/TextLink";
import { nav } from "@/lib/data";

export const Nav = () => {
  return (
    <nav className="flex gap-5 text-sm">
      {nav.map((item) => (
        <TextLink key={item.href} href={item.href}>
          {item.label}
        </TextLink>
      ))}
    </nav>
  );
};
