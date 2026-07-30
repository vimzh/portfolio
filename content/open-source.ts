import type { Contribution, Link } from "@/types/data";

export const openSourceCopy = {
  heading: "open source",
} as const;

// `link` points at each repo for now; swap it for the specific PR URL when available.
export const openSource = [
  {
    owner: "fb55",
    repo: "htmlparser2",
    stars: "4.8k",
    description:
      "Add WebWritableStream for Web Streams API support, enabling piping fetch() responses directly into the parser",
    status: "Merged",
    link: "https://github.com/fb55/htmlparser2",
  },
  {
    owner: "inokawa",
    repo: "virtua",
    stars: "3.5k",
    description:
      "Add Base UI ScrollArea story for virtualized scrolling with custom scrollbars",
    status: "Merged",
    link: "https://github.com/inokawa/virtua",
  },
  {
    owner: "aymericzip",
    repo: "intlayer",
    stars: "636",
    description:
      "Replace native textarea with contentEditable div for inline autocomplete ghost text rendering",
    status: "Merged",
    link: "https://github.com/aymericzip/intlayer",
  },
] as const satisfies readonly Contribution[];

// Compact overflow entries displayed after the detailed contributions.
export const moreContributions = [
  { label: "supermemory", href: "https://github.com/supermemoryai/supermemory" },
  { label: "kandev", href: "https://github.com/kandev" },
  { label: "payloadcms", href: "https://github.com/payloadcms/payload" },
] as const satisfies readonly Link[];
