import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const spriteModules = import.meta.glob('/src/sprites/pets/*/*/*.png', { eager: true });
const spriteUrlMap = {};
for (const [path, mod] of Object.entries(spriteModules)) {
  // path: '/src/sprites/pets/1/3/F_0.png'
  spriteUrlMap[path] = mod.default;
}

// Helper to get the correct URL
function getSpriteUrl(e0, e1, dir, frame) {
  return `/src/sprites/pets/${e0}/${e1}/${dir}_${frame}.png`;
}

export default function SpriteAnimator({ evolution_id, direction, flipInterval = 0.5, onClick }) {
  const isEgg = evolution_id[0] === 0;
  // For eggs, always use "F"
  const actualDirection = isEgg ? "F" : direction;

  // Load F textures (always needed)
  const url_F_0 = spriteUrlMap[getSpriteUrl(evolution_id[0], evolution_id[1], "F", 0)];
  const url_F_1 = spriteUrlMap[getSpriteUrl(evolution_id[0], evolution_id[1], "F", 1)];
  const texture_F_0 = useTexture(url_F_0);
  const texture_F_1 = useTexture(url_F_1);
  console.log("SpriteAnimator loading:", url_F_0);
  console.log("SpriteAnimator loading:", url_F_1);
  const texturesF = [texture_F_0, texture_F_1];

  let texturesU, texturesR, texturesL;
  if (!isEgg) {
    // Load additional directions only if not an egg
    const url_U_0 = spriteUrlMap[getSpriteUrl(evolution_id[0], evolution_id[1], "U", 0)];
    const url_U_1 = spriteUrlMap[getSpriteUrl(evolution_id[0], evolution_id[1], "U", 1)];
    const texture_U_0 = useTexture(url_U_0);
    const texture_U_1 = useTexture(url_U_1);
    texturesU = [texture_U_0, texture_U_1];

    const url_R_0 = spriteUrlMap[getSpriteUrl(evolution_id[0], evolution_id[1], "R", 0)];
    const url_R_1 = spriteUrlMap[getSpriteUrl(evolution_id[0], evolution_id[1], "R", 1)];
    const texture_R_0 = useTexture(url_R_0);
    const texture_R_1 = useTexture(url_R_1);
    texturesR = [texture_R_0, texture_R_1];

    const url_L_0 = spriteUrlMap[getSpriteUrl(evolution_id[0], evolution_id[1], "L", 0)];
    const url_L_1 = spriteUrlMap[getSpriteUrl(evolution_id[0], evolution_id[1], "L", 1)];
    const texture_L_0 = useTexture(url_L_0);
    const texture_L_1 = useTexture(url_L_1);
    texturesL = [texture_L_0, texture_L_1];
  } else {
    // For eggs, reuse the F textures.
    texturesU = texturesF;
    texturesR = texturesF;
    texturesL = texturesF;
  }

  // Set texture filters for crisp pixel art.
  const allTextures = [...texturesF, ...texturesU, ...texturesR, ...texturesL];
  allTextures.forEach((tex) => {
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
  });

  // Organize textures by direction.
  const textures = {
    F: texturesF,
    U: texturesU,
    R: texturesR,
    L: texturesL,
  };

  // Animation state.
  const [frameIndex, setFrameIndex] = useState(0);
  const timeAccumulator = useRef(0);

  // Reset animation when actualDirection changes.
  useEffect(() => {
    setFrameIndex(0);
    timeAccumulator.current = 0;
  }, [actualDirection]);

  // Advance frames using useFrame, so this runs every frame.
  useFrame((state, delta) => {
    timeAccumulator.current += delta;
    if (timeAccumulator.current >= flipInterval) {
      setFrameIndex((prev) => (prev + 1) % textures[actualDirection].length);
      timeAccumulator.current = 0;
    }
  });    return (
    <sprite scale={[1, 1, 1]}>
      <spriteMaterial attach="material" map={textures[actualDirection][frameIndex]} transparent />
    </sprite>
  );
}

