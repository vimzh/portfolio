import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

import type { HugeiconsIconProps } from "@hugeicons/react";

/**
 * Thin wrapper around HugeiconsIcon that centralizes the default stroke weight
 * and size so icons stay consistent across the site. Pass an icon from
 * @hugeicons/core-free-icons via the `icon` prop.
 */
export const Icon = ({
  className,
  strokeWidth = 2,
  ...props
}: HugeiconsIconProps) => (
  <HugeiconsIcon
    strokeWidth={strokeWidth}
    className={cn("size-4", className)}
    {...props}
  />
);
