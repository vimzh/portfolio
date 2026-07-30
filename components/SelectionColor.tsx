"use client";

import { useEffect } from "react";

const selectionHues = [266, 95, 160, 350, 230, 50];

export const SelectionColor = () => {
  useEffect(() => {
    const root = document.documentElement;

    // ::selection does not resolve var() references, so each pastel is emitted
    // as a literal-valued rule keyed by [data-selection-hue] and toggled below.
    const style = document.createElement("style");
    style.textContent = selectionHues
      .map(
        (hue) =>
          `[data-selection-hue="${hue}"] ::selection{background-color:oklch(0.9 0.08 ${hue});color:oklch(0.22 0 0)}`,
      )
      .join("");
    document.head.appendChild(style);

    let last = -1;
    const randomize = () => {
      let i = Math.floor(Math.random() * selectionHues.length);
      if (i === last) i = (i + 1) % selectionHues.length;
      last = i;
      root.dataset.selectionHue = String(selectionHues[i]);
    };

    randomize();
    document.addEventListener("selectstart", randomize, { passive: true });
    return () => {
      document.removeEventListener("selectstart", randomize);
      style.remove();
    };
  }, []);

  return null;
};
