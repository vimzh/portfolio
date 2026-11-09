// Public swarm configuration stays independent of React and the renderer.
export type BeePosition = { x: number; y: number };

export const DEFAULT_BEE_OPTIONS = {
  count: 4,
  minSize: 14,
  maxSize: 28,
  randomizeSize: true,
  orbitRadius: 96,
  orbitSpeed: 0.6,
  followSpeed: 3,
  paused: false,
} as const;

export type BeeOptions = { [K in keyof typeof DEFAULT_BEE_OPTIONS]:
  K extends "paused" | "randomizeSize" ? boolean : number };

export type BeeSwarmProps = Partial<BeeOptions> & {
  /** Initial target in viewport CSS pixels; ignored after the first mouse move. */
  initialPosition?: BeePosition;
  onError?: (error: Error) => void;
};

export function resolveBeeOptions(props: Partial<BeeOptions>): BeeOptions {
  const {
    count = DEFAULT_BEE_OPTIONS.count,
    minSize = DEFAULT_BEE_OPTIONS.minSize,
    maxSize = DEFAULT_BEE_OPTIONS.maxSize,
    randomizeSize = DEFAULT_BEE_OPTIONS.randomizeSize,
    orbitRadius = DEFAULT_BEE_OPTIONS.orbitRadius,
    orbitSpeed = DEFAULT_BEE_OPTIONS.orbitSpeed,
    followSpeed = DEFAULT_BEE_OPTIONS.followSpeed,
    paused = DEFAULT_BEE_OPTIONS.paused,
  } = props;
  const options = { count, minSize, maxSize, randomizeSize, orbitRadius, orbitSpeed, followSpeed, paused };
  for (const key of Object.keys(DEFAULT_BEE_OPTIONS) as (keyof BeeOptions)[]) {
    if (key === "paused" || key === "randomizeSize") continue;
    if (!Number.isFinite(options[key])) {
      throw new RangeError(`BeeSwarm: ${key} must be a finite number.`);
    }
  }
  if (!Number.isInteger(options.count) || options.count < 0 || options.count > 20) {
    throw new RangeError("BeeSwarm: count must be an integer from 0 to 20.");
  }
  if (options.minSize <= 0 || options.maxSize < options.minSize) {
    throw new RangeError("BeeSwarm: sizes must satisfy 0 < minSize <= maxSize.");
  }
  if (options.orbitRadius < 0 || options.orbitSpeed < 0 || options.followSpeed <= 0) {
    throw new RangeError("BeeSwarm: orbitRadius and orbitSpeed must be non-negative; followSpeed must be positive.");
  }
  if (typeof options.paused !== "boolean") {
    throw new TypeError("BeeSwarm: paused must be a boolean.");
  }
  if (typeof options.randomizeSize !== "boolean") {
    throw new TypeError("BeeSwarm: randomizeSize must be a boolean.");
  }
  return options;
}

export function validateBeePosition(position?: BeePosition): void {
  if (position && (!Number.isFinite(position.x) || !Number.isFinite(position.y))) {
    throw new RangeError("BeeSwarm: initialPosition must contain finite x and y coordinates.");
  }
}
