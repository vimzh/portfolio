"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

import { metaThemeColors } from "@/lib/data";

/**
 * Keeps the browser chrome color (`meta[name="theme-color"]`) in sync with the
 * resolved theme. next-themes toggles a class, which the media-query based meta
 * tag would otherwise ignore, leaving the chrome stuck on the OS preference.
 */
export const MetaColor = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color =
      resolvedTheme === "dark" ? metaThemeColors.dark : metaThemeColors.light;

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", color);
  }, [resolvedTheme]);

  return null;
};
