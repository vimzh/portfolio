// Interface copy and control ranges for the cursor bee demo.
export const beesCopy = {
  heading: "bees",
  description:
    "A small swarm of Minecraft bees. Move your cursor and let them catch up.",
  pause: "Pause bees",
  resume: "Resume bees",
  reset: "Reset",
  unavailable: "Bees unavailable",
  retryHint: "Select Reset to try again.",
  controlsHeading: "Make it your swarm",
  controlsDescription: "Changes apply as you move the sliders.",
  randomSizeLabel: "Random sizes",
  randomSizeHint: "Vary sizes between the minimum and maximum. Turn off to use the maximum size for every bee.",
  previewLabel: "Bee preview",
  previewHint: "Move your cursor here",
  pausedHint: "The swarm is paused",
  emptyHint: "Increase the count to bring the bees back",
  disabledHint:
    "The bees are disabled on touch-only devices and when reduced motion is enabled.",
  snippetHeading: "Use this configuration",
  copy: "Copy JSX",
  copied: "Copied",
  copyError: "Could not copy. Select the code below and copy it manually.",
  sizeHint: "Sizes describe body length in pixels at the central depth.",
  artworkNotice:
    "Minecraft bee artwork © Mojang AB. Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.",
  sourceLabel: "Artwork source",
  sourceHref:
    "https://github.com/Mojang/bedrock-samples/tree/main/resource_pack/textures/entity/bee",
  termsLabel: "Usage terms",
  termsHref: "https://www.minecraft.net/en-us/usage-guidelines",
} as const;

export type BeeControlKey =
  | "count"
  | "minSize"
  | "maxSize"
  | "orbitRadius"
  | "orbitSpeed"
  | "followSpeed";

export const beeControls = [
  { key: "count", label: "Bees", min: 0, max: 20, step: 1, unit: "" },
  { key: "minSize", label: "Minimum size", min: 12, max: 80, step: 1, unit: "px" },
  { key: "maxSize", label: "Maximum size", min: 12, max: 80, step: 1, unit: "px" },
  { key: "orbitRadius", label: "Flight radius", min: 24, max: 180, step: 1, unit: "px" },
  { key: "orbitSpeed", label: "Flight speed", min: 0.1, max: 2, step: 0.1, unit: "/s" },
  { key: "followSpeed", label: "Follow speed", min: 1, max: 8, step: 0.5, unit: "/s" },
] as const satisfies readonly {
  key: BeeControlKey;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}[];
