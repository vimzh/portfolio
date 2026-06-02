import Link from "next/link";

import { cn } from "@/lib/utils";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type TextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

const baseStyles =
  "rounded-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:outline-none";

const isHttp = (href: string) => /^https?:\/\//.test(href);
const isProtocol = (href: string) => /^(mailto|tel):/.test(href);

export const TextLink = ({
  href,
  children,
  className,
  ...props
}: TextLinkProps) => {
  if (isHttp(href) || isProtocol(href)) {
    return (
      <a
        href={href}
        {...(isHttp(href)
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className={cn(baseStyles, className)}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(baseStyles, className)} {...props}>
      {children}
    </Link>
  );
};
