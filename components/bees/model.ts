// Builds shared, atlas-mapped meshes from Mojang's pinned bee geometry.
import {
  BoxGeometry,
  BufferGeometry,
  Group,
  Mesh,
  MeshLambertMaterial,
  NearestFilter,
  SRGBColorSpace,
  DoubleSide,
  Texture,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

import reference from "../../public/bees/bee.geo.json";

type Cube = { origin: number[]; size: number[]; uv: number[] };
type Bone = {
  name: string;
  pivot: number[];
  rotation?: number[];
  cubes: Cube[];
};

export type BeeObject = {
  group: Group;
  leftWing: Group;
  rightWing: Group;
};

export type BeeModel = {
  createBee(): BeeObject;
  dispose(): void;
};

const bones: Bone[] = reference["minecraft:geometry"][0].bones;
const atlas = reference["minecraft:geometry"][0].description;
const bodyCube = bones[0].cubes[0];
const center = bodyCube.origin.map((value, axis) => value + bodyCube.size[axis] / 2);
const radians = Math.PI / 180;

function bone(name: string): Bone {
  const result = bones.find((entry) => entry.name === name);
  if (!result) throw new Error(`Bee model is missing the ${name} bone.`);
  return result;
}

function cubeGeometry(cube: Cube): BufferGeometry {
  const [width, height, depth] = cube.size;
  const [u, v] = cube.uv;
  const geometry = new BoxGeometry(width, height, depth);

  // Bedrock box UV order matches Three's +X, -X, +Y, -Y, +Z, -Z faces.
  // The top is turned 180 degrees and the bottom is mirrored horizontally.
  const faces = [
    [u, v + depth, u + depth, v + depth + height],
    [u + depth + width, v + depth, u + 2 * depth + width, v + depth + height],
    [u + depth + width, v + depth, u + depth, v],
    [u + depth + 2 * width, v, u + depth + width, v + depth],
    [u + 2 * depth + width, v + depth, u + 2 * (depth + width), v + depth + height],
    [u + depth, v + depth, u + depth + width, v + depth + height],
  ];
  const uv = geometry.getAttribute("uv");
  for (let face = 0; face < faces.length; face++) {
    const [left, top, right, bottom] = faces[face];
    uv.setXY(face * 4, left / atlas.texture_width, 1 - top / atlas.texture_height);
    uv.setXY(face * 4 + 1, right / atlas.texture_width, 1 - top / atlas.texture_height);
    uv.setXY(face * 4 + 2, left / atlas.texture_width, 1 - bottom / atlas.texture_height);
    uv.setXY(face * 4 + 3, right / atlas.texture_width, 1 - bottom / atlas.texture_height);
  }

  // Appendages are textured planes. Keep one face and let DoubleSide render its
  // reverse, avoiding coincident triangles and the empty opposite UV region.
  const planeFace = width === 0 ? 0 : height === 0 ? 2 : depth === 0 ? 5 : -1;
  if (planeFace !== -1) {
    const index = geometry.getIndex()!;
    geometry.setIndex(Array.from(index.array.slice(planeFace * 6, planeFace * 6 + 6)));
  }
  geometry.clearGroups();
  geometry.translate(
    cube.origin[0] + width / 2,
    cube.origin[1] + height / 2,
    cube.origin[2] + depth / 2,
  );
  return geometry;
}

function bodyGeometry(): BufferGeometry {
  const parts = bone("body").cubes.map(cubeGeometry);
  parts.push(...bone("stinger").cubes.map(cubeGeometry));
  for (const [name, angle] of [["leg_front", 15], ["leg_mid", 15], ["leg_back", 30]] as const) {
    const leg = bone(name);
    for (const cube of leg.cubes) {
      const part = cubeGeometry(cube);
      part.translate(-leg.pivot[0], -leg.pivot[1], -leg.pivot[2]);
      part.rotateX(angle * radians);
      part.translate(leg.pivot[0], leg.pivot[1], leg.pivot[2]);
      parts.push(part);
    }
  }
  const merged = mergeGeometries(parts);
  for (const part of parts) part.dispose();
  if (!merged) throw new Error("Bee model geometry could not be merged.");
  merged.translate(-center[0], -center[1], -center[2]);
  merged.computeBoundingSphere();
  return merged;
}

function wingGeometry(wing: Bone): BufferGeometry {
  const geometry = cubeGeometry(wing.cubes[0]);
  geometry.translate(-wing.pivot[0], -wing.pivot[1], -wing.pivot[2]);
  geometry.computeBoundingSphere();
  return geometry;
}

function wingObject(wing: Bone, geometry: BufferGeometry, material: MeshLambertMaterial) {
  const rest = new Group();
  rest.position.set(wing.pivot[0] - center[0], wing.pivot[1] - center[1], wing.pivot[2] - center[2]);
  const rotation = wing.rotation!;
  rest.rotation.set(rotation[0] * radians, rotation[1] * radians, rotation[2] * radians);
  const hinge = new Group();
  hinge.name = wing.name;
  hinge.add(new Mesh(geometry, material));
  rest.add(hinge);
  return { rest, hinge };
}

export async function loadBeeModel(signal: AbortSignal): Promise<BeeModel> {
  const response = await fetch("/bees/bee.png", { signal });
  if (!response.ok) throw new Error(`Bee texture /bees/bee.png could not load: HTTP ${response.status}.`);
  const blob = await response.blob();
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(blob, {
      imageOrientation: "flipY",
      premultiplyAlpha: "none",
      colorSpaceConversion: "none",
    });
  } catch (cause) {
    signal.throwIfAborted();
    throw new Error("Bee texture /bees/bee.png could not be decoded. Check that the original PNG is available.", { cause });
  }
  let texture: Texture | undefined;
  let material: MeshLambertMaterial | undefined;
  const geometries: BufferGeometry[] = [];

  try {
    signal.throwIfAborted();
    if (bitmap.width !== atlas.texture_width || bitmap.height !== atlas.texture_height) {
      throw new Error("Bee texture must match the model's 64 × 64 pixel atlas.");
    }
    texture = new Texture(bitmap);
    texture.colorSpace = SRGBColorSpace;
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    material = new MeshLambertMaterial({
      map: texture,
      alphaTest: 0.5,
      side: DoubleSide,
      toneMapped: false,
    });
    const body = bodyGeometry();
    geometries.push(body);
    const left = bone("leftwing_bone");
    const right = bone("rightwing_bone");
    const leftGeometry = wingGeometry(left);
    geometries.push(leftGeometry);
    const rightGeometry = wingGeometry(right);
    geometries.push(rightGeometry);
    let disposed = false;
    const sharedMaterial = material;
    const sharedTexture = texture;

    return {
      createBee() {
        if (disposed) throw new Error("Cannot create a bee from a disposed model.");
        const group = new Group();
        group.name = "minecraft-bee";
        const bodyMesh = new Mesh(body, sharedMaterial);
        bodyMesh.name = "body";
        const leftWing = wingObject(left, leftGeometry, sharedMaterial);
        const rightWing = wingObject(right, rightGeometry, sharedMaterial);
        group.add(bodyMesh, leftWing.rest, rightWing.rest);
        return { group, leftWing: leftWing.hinge, rightWing: rightWing.hinge };
      },
      dispose() {
        if (disposed) return;
        disposed = true;
        for (const geometry of geometries) geometry.dispose();
        sharedMaterial.dispose();
        sharedTexture.dispose();
        bitmap.close();
      },
    };
  } catch (error) {
    for (const geometry of geometries) geometry.dispose();
    material?.dispose();
    texture?.dispose();
    bitmap.close();
    throw error;
  }
}
