// Independent smooth 3D wandering with spherical bounds and wing-aware separation.
import type { BeeOptions, BeePosition } from "./config";

export const MAX_FLIGHT_SPEED = 600;
export const MAX_FLIGHT_ACCELERATION = 1800;
export const MAX_FRAME_DELTA = 0.05;
const STEP = 1 / 120;
const GAP = 8.25;

export type BeeMotion = {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  ox: number; oy: number; oz: number;
  ux: number; uy: number; uz: number;
  index: number; phase: number; size: number; radius: number;
  direction: 1 | -1;
  initialized: boolean;
};

export type SwarmMotion = {
  x: number; y: number; vx: number; vy: number;
  time: number; radius: number;
};

function random(index: number, salt = 4): number {
  let value = Math.imul(index + 1, 374761393) ^ Math.imul(salt, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
}

export function createSwarmMotion(target: BeePosition): SwarmMotion {
  return { x: target.x, y: target.y, vx: 0, vy: 0, time: 0, radius: 0 };
}

export function createBeeMotion(index: number): BeeMotion {
  return { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, ox: 0, oy: 0, oz: 0,
    ux: 0, uy: 0, uz: 0, index, phase: index * 2.399963229728653,
    size: random(index), radius: 0, direction: index % 2 === 0 ? 1 : -1, initialized: false };
}

export function getBeeSize(bee: BeeMotion, options: BeeOptions): number {
  const variation = (bee.index + bee.size) / Math.max(1, options.count);
  return options.randomizeSize
    ? options.minSize + (options.maxSize - options.minSize) * variation
    : options.maxSize;
}

export function getFlightRadius(options: BeeOptions): number {
  // Give dense swarms room in a volume instead of spreading them onto a ring.
  return Math.max(options.orbitRadius, options.count > 1
    ? (options.maxSize * 1.3 + GAP / 2) * 1.6 * Math.cbrt(options.count) : 0);
}

export function getSwarmCameraDistance(height: number, options: BeeOptions): number {
  return Math.max(height / (2 * Math.tan(60 * Math.PI / 360)),
    getFlightRadius(options) * 3 + options.maxSize * 2.6);
}

function contain(bee: BeeMotion, radius: number) {
  const distance = Math.hypot(bee.ox, bee.oy, bee.oz);
  if (distance <= radius) return false;
  const scale = radius / distance;
  bee.ox *= scale; bee.oy *= scale; bee.oz *= scale;
  const outward = (bee.ox * bee.ux + bee.oy * bee.uy + bee.oz * bee.uz) / Math.max(radius, 1);
  if (outward > 0) {
    const impulse = outward / Math.max(radius, 1);
    bee.ux -= bee.ox * impulse; bee.uy -= bee.oy * impulse; bee.uz -= bee.oz * impulse;
  }
  return true;
}

function separate(bees: readonly BeeMotion[], radius: number) {
  // At most 190 pairs. Most frames finish after one pass; extra passes handle
  // initial placement and live count/size changes without intersecting wings.
  for (let pass = 0; pass < 20; pass++) {
    let penetration = 0;
    for (let i = 0; i < bees.length; i++) {
      const a = bees[i];
      for (let j = i + 1; j < bees.length; j++) {
        const b = bees[j];
        let dx = b.ox - a.ox, dy = b.oy - a.oy, dz = b.oz - a.oz;
        let distance = Math.hypot(dx, dy, dz);
        const minimum = a.radius + b.radius + GAP;
        if (distance >= minimum) continue;
        if (distance < 1e-9) {
          dx = Math.cos(b.phase); dy = Math.sin(b.phase); dz = 0.5;
          distance = Math.hypot(dx, dy, dz);
          dx /= distance; dy /= distance; dz /= distance;
          distance = 0;
        } else {
          dx /= distance; dy /= distance; dz /= distance;
        }
        const push = (minimum - distance) / 2;
        penetration = Math.max(penetration, push * 2);
        a.ox -= dx * push; a.oy -= dy * push; a.oz -= dz * push;
        b.ox += dx * push; b.oy += dy * push; b.oz += dz * push;
        const approaching = (b.ux - a.ux) * dx + (b.uy - a.uy) * dy + (b.uz - a.uz) * dz;
        if (approaching < 0) {
          const impulse = approaching / 2;
          a.ux += dx * impulse; a.uy += dy * impulse; a.uz += dz * impulse;
          b.ux -= dx * impulse; b.uy -= dy * impulse; b.uz -= dz * impulse;
        }
      }
    }
    let bounded = false;
    for (const bee of bees) bounded = contain(bee, radius) || bounded;
    if (penetration < 1e-5 && !bounded) break;
  }
}

/** Reflow live configuration without changing the independent flight clock. */
export function positionBeeSwarm(swarm: SwarmMotion, bees: readonly BeeMotion[], options: BeeOptions): void {
  const radius = getFlightRadius(options);
  for (const bee of bees) {
    bee.radius = getBeeSize(bee, options) * 1.3;
    if (!bee.initialized) {
      const z = 1 - 2 * (bee.index + 0.5) / Math.max(1, bees.length);
      const length = radius * (0.5 + bee.size * 0.35);
      const horizontal = Math.sqrt(Math.max(0, 1 - z * z));
      bee.ox = Math.cos(bee.phase + 0.5) * horizontal * length;
      bee.oy = Math.sin(bee.phase + 0.5) * horizontal * length;
      bee.oz = z * length;
      bee.initialized = true;
    } else if (swarm.radius > 0 && swarm.radius !== radius) {
      const scale = radius / swarm.radius;
      bee.ox *= scale; bee.oy *= scale; bee.oz *= scale;
    }
    contain(bee, radius);
  }
  swarm.radius = radius;
  separate(bees, radius);
  for (const bee of bees) {
    bee.x = swarm.x + bee.ox; bee.y = swarm.y + bee.oy; bee.z = bee.oz;
  }
}

function wander(bee: BeeMotion, time: number, dt: number, radius: number, options: BeeOptions) {
  const rate = Math.min(options.orbitSpeed, 3);
  if (rate === 0) {
    bee.ux = 0; bee.uy = 0; bee.uz = 0;
    return;
  }
  const speed = Math.min(90, radius * rate * (0.65 + bee.size * 0.5));
  // Incommensurate frequencies and phases change direction on each axis; there
  // is no common angular phase, plane, winding direction, or fixed flight radius.
  const x = Math.sin(time * rate * (0.7 + random(bee.index, 1)) + bee.phase + 1.2);
  const y = Math.sin(time * rate * (0.6 + random(bee.index, 2)) + bee.phase * 1.7 + 3.1);
  const z = Math.sin(time * rate * (0.8 + random(bee.index, 3)) + bee.phase * 0.8 + 4.8);
  const horizontal = Math.hypot(bee.ox, bee.oy);
  const radialX = horizontal > 1e-6 ? bee.ox / horizontal : Math.cos(bee.phase);
  const radialY = horizontal > 1e-6 ? bee.oy / horizontal : Math.sin(bee.phase);
  // Balance clockwise/anticlockwise travel explicitly; radial and depth wander
  // keep each path irregular instead of constraining bees to circular tracks.
  const radialSpeed = (x * radialX + y * radialY) * speed * 0.65;
  const tangentSpeed = bee.direction * speed * 0.9;
  const desiredX = radialX * radialSpeed - radialY * tangentSpeed;
  const desiredY = radialY * radialSpeed + radialX * tangentSpeed;
  const distance = Math.hypot(bee.ox, bee.oy, bee.oz);
  const boundary = Math.max(0, distance / Math.max(radius, 1) - 0.65) * 8;
  let ax = (desiredX - bee.ux) * 1.8 - bee.ox * boundary;
  let ay = (desiredY - bee.uy) * 1.8 - bee.oy * boundary;
  let az = (z * speed - bee.uz) * 1.8 - bee.oz * boundary;
  const acceleration = Math.hypot(ax, ay, az);
  if (acceleration > MAX_FLIGHT_ACCELERATION / 4) {
    const limit = MAX_FLIGHT_ACCELERATION / 4 / acceleration;
    ax *= limit; ay *= limit; az *= limit;
  }
  bee.ux += ax * dt; bee.uy += ay * dt; bee.uz += az * dt;
  const velocity = Math.hypot(bee.ux, bee.uy, bee.uz);
  if (velocity > 150) {
    const limit = 150 / velocity;
    bee.ux *= limit; bee.uy *= limit; bee.uz *= limit;
  }
  bee.ox += bee.ux * dt; bee.oy += bee.uy * dt; bee.oz += bee.uz * dt;
}

/** A bounded pursuit center carries independent local 3D motion to the cursor. */
export function advanceBeeSwarm(
  swarm: SwarmMotion, bees: readonly BeeMotion[], delta: number,
  target: BeePosition, options: BeeOptions,
): void {
  if (options.paused || delta <= 0) return;
  const elapsed = Math.min(delta, MAX_FRAME_DELTA);
  const steps = Math.ceil(elapsed / STEP);
  const dt = elapsed / steps;
  const stiffness = Math.min(options.followSpeed, 30);
  for (let step = 0; step < steps; step++) {
    let ax = stiffness * stiffness * (target.x - swarm.x) - 2 * stiffness * swarm.vx;
    let ay = stiffness * stiffness * (target.y - swarm.y) - 2 * stiffness * swarm.vy;
    const acceleration = Math.hypot(ax, ay);
    if (acceleration > MAX_FLIGHT_ACCELERATION / 2) {
      const limit = MAX_FLIGHT_ACCELERATION / 2 / acceleration;
      ax *= limit; ay *= limit;
    }
    swarm.vx += ax * dt; swarm.vy += ay * dt;
    const speed = Math.hypot(swarm.vx, swarm.vy);
    if (speed > MAX_FLIGHT_SPEED - 240) {
      const limit = (MAX_FLIGHT_SPEED - 240) / speed;
      swarm.vx *= limit; swarm.vy *= limit;
    }
    swarm.x += swarm.vx * dt; swarm.y += swarm.vy * dt;
    swarm.time += dt;
    for (const bee of bees) wander(bee, swarm.time, dt, swarm.radius, options);
    separate(bees, swarm.radius);
    for (const bee of bees) {
      const x = swarm.x + bee.ox, y = swarm.y + bee.oy, z = bee.oz;
      bee.vx = (x - bee.x) / dt; bee.vy = (y - bee.y) / dt; bee.vz = (z - bee.z) / dt;
      bee.x = x; bee.y = y; bee.z = z;
    }
  }
}
