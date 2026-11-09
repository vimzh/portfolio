// Owns the WebGL scene, browser events, and imperative flight animation.
import {
  AmbientLight, DirectionalLight, Matrix4, PerspectiveCamera,
  Quaternion, Scene, SRGBColorSpace, Vector3, WebGLRenderer,
} from "three";

import type { BeeOptions, BeePosition } from "./config";
import { loadBeeModel } from "./model";
import type { BeeObject } from "./model";
import { advanceBeeSwarm, createBeeMotion, createSwarmMotion, getBeeSize, getSwarmCameraDistance, MAX_FRAME_DELTA, positionBeeSwarm } from "./simulation";
import type { BeeMotion } from "./simulation";

export type SwarmController = {
  update: (options: BeeOptions, initialPosition?: BeePosition) => void;
  setPointer: (position: BeePosition) => void;
  dispose: () => void;
};

export async function createSwarm(
  canvas: HTMLCanvasElement,
  initialOptions: BeeOptions,
  initialPosition: BeePosition | undefined,
  onError: (error: Error) => void,
  signal: AbortSignal,
): Promise<SwarmController> {
  signal.throwIfAborted();
  const context = canvas.getContext("webgl2", { alpha: true, antialias: false, powerPreference: "low-power" });
  if (!context) throw new Error("BeeSwarm requires WebGL 2. Enable hardware acceleration in your browser.");
  const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: false });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  scene.add(new AmbientLight(0xffffff, 1.3));
  const sun = new DirectionalLight(0xffffff, 1.8);
  sun.position.set(-3, 6, 8);
  scene.add(sun);
  const camera = new PerspectiveCamera(35, 1, 0.1, 20000);
  const target = { x: 0, y: 0 };
  let anchor = initialPosition;
  let hasPointer = false;
  let width = 1;
  let height = 1;
  let options = initialOptions;
  let disposed = false;
  let running = false;
  let lastFrame: number | null = null;
  const swarm = createSwarmMotion(target);
  let model: Awaited<ReturnType<typeof loadBeeModel>> | undefined;
  const bees: { object: BeeObject; motion: BeeMotion }[] = [];
  const motions: BeeMotion[] = [];
  const direction = new Vector3();
  const zero = new Vector3();
  const up = new Vector3(0, 1, 0);
  const rotation = new Matrix4();
  const facing = new Quaternion();
  const bank = new Quaternion();
  const forward = new Vector3(0, 0, 1);
  const heading = new Vector3();
  const listeners = new AbortController();

  function setTarget(position: BeePosition) {
    // Keep the central plane target on screen, including after viewport resize.
    target.x = Math.max(0, Math.min(width, position.x));
    target.y = Math.max(0, Math.min(height, position.y));
  }

  function setPointer(position: BeePosition) {
    hasPointer = true;
    setTarget(position);
  }

  function updateCamera() {
    camera.aspect = width / height;
    camera.position.z = getSwarmCameraDistance(height, options);
    // Preserve one world unit per CSS pixel when density changes the distance.
    camera.fov = Math.atan(height / (2 * camera.position.z)) * 360 / Math.PI;
    camera.far = Math.max(20000, camera.position.z * 4);
    camera.updateProjectionMatrix();
  }

  function resize() {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    updateCamera();
    if (!hasPointer) setTarget(anchor ?? { x: width / 2, y: height / 2 });
    else setTarget(target);
    if (model) positionBeeSwarm(swarm, motions, options);
    if (model && !running && !document.hidden) renderFrame(0);
  }

  function syncCount() {
    if (!model) return;
    while (bees.length > options.count) {
      const bee = bees.pop()!;
      scene.remove(bee.object.group);
      motions.pop();
    }
    while (bees.length < options.count) {
      const object = model.createBee();
      const motion = createBeeMotion(bees.length);
      object.group.rotation.y = Math.PI;
      scene.add(object.group);
      bees.push({ object, motion });
      motions.push(motion);
    }
  }

  function renderFrame(delta: number) {
    advanceBeeSwarm(swarm, motions, delta, target, options);
    for (const { object, motion } of bees) {
      const scale = getBeeSize(motion, options) / 10;
      object.group.scale.setScalar(scale);
      object.group.position.set(motion.x - width / 2, height / 2 - motion.y, motion.z);
      const horizontalSpeed = Math.hypot(motion.vx, motion.vz);
      if (horizontalSpeed > 1) {
        // Ascend with a gentle pitch; bees stay upright during vertical pursuit.
        const pitch = Math.max(-horizontalSpeed * 0.35, Math.min(horizontalSpeed * 0.35, -motion.vy));
        direction.set(motion.vx, pitch, motion.vz).normalize();
        heading.set(0, 0, -1).applyQuaternion(object.group.quaternion);
        const turn = heading.x * direction.z - heading.z * direction.x;
        rotation.lookAt(zero, direction, up);
        facing.setFromRotationMatrix(rotation);
        bank.setFromAxisAngle(forward, Math.max(-0.3, Math.min(0.3, turn * 0.8)));
        facing.multiply(bank);
        object.group.quaternion.slerp(facing, 1 - Math.exp(-5 * delta));
      }
      const flutter = Math.cos(swarm.time * Math.PI * 10 + motion.phase) * (35 * Math.PI / 180);
      object.leftWing.rotation.z = flutter;
      object.rightWing.rotation.z = -flutter;
    }
    renderer.render(scene, camera);
  }

  function frame(now: number) {
    if (disposed) return;
    const delta = lastFrame === null ? 0 : Math.min(Math.max(0, (now - lastFrame) / 1000), MAX_FRAME_DELTA);
    lastFrame = now;
    try {
      renderFrame(delta);
    } catch (error) {
      fail(error instanceof Error ? error : new Error(String(error)));
    }
  }

  function syncAnimation() {
    if (disposed || !model) return;
    const shouldRun = !options.paused && !document.hidden;
    if (running === shouldRun) return;
    running = shouldRun;
    lastFrame = null;
    renderer.setAnimationLoop(shouldRun ? frame : null);
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    listeners.abort();
    signal.removeEventListener("abort", dispose);
    renderer.setAnimationLoop(null);
    scene.clear();
    bees.length = 0;
    motions.length = 0;
    model?.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  function fail(error: Error) {
    dispose();
    onError(error);
  }

  signal.addEventListener("abort", dispose, { once: true });
  const eventOptions = { passive: true, signal: listeners.signal };
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "mouse") setPointer({ x: event.clientX, y: event.clientY });
  }, eventOptions);
  window.addEventListener("resize", resize, eventOptions);
  document.addEventListener("visibilitychange", syncAnimation, eventOptions);
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    fail(new Error("BeeSwarm: the WebGL context was lost. Reload the page to restart the bees."));
  }, { signal: listeners.signal });

  try {
    resize();
    model = await loadBeeModel(listeners.signal);
    if (disposed || signal.aborted) {
      model.dispose();
      signal.throwIfAborted();
      throw new Error("BeeSwarm was disposed during initialization.");
    }
    syncCount();
    swarm.x = target.x;
    swarm.y = target.y;
    positionBeeSwarm(swarm, motions, options);
    if (!document.hidden) renderFrame(0);
    syncAnimation();
  } catch (error) {
    dispose();
    throw error;
  }

  return {
    setPointer,
    update(next, position) {
      if (disposed) return;
      options = next;
      updateCamera();
      anchor = position;
      if (!hasPointer && position) setTarget(position);
      syncCount();
      positionBeeSwarm(swarm, motions, options);
      syncAnimation();
      if (!running && !document.hidden) renderFrame(0);
    },
    dispose,
  };
}
