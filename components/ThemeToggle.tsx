"use client";

import { useTheme } from "next-themes";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { click003Sound } from "@/lib/click-003";
import { playSound } from "@/lib/sound-engine";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    void playSound(click003Sound.dataUri);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Icon icon={Sun03Icon} className="hidden size-4 dark:block" />
            <Icon icon={Moon02Icon} className="size-4 dark:hidden" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="pb-2 leading-normal">
          {resolvedTheme === "dark" ? "Dark" : "Light"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
