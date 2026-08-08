"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

import { metaThemeColors } from "@/lib/theme";

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
