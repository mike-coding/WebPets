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

  // Generate URLs for all possible textures
  const url_F_0 = getSpriteUrl(evolution_id[0], evolution_id[1], "F", 0);
  const url_F_1 = getSpriteUrl(evolution_id[0], evolution_id[1], "F", 1);
  const url_U_0 = getSpriteUrl(evolution_id[0], evolution_id[1], "U", 0);
  const url_U_1 = getSpriteUrl(evolution_id[0], evolution_id[1], "U", 1);
  const url_R_0 = getSpriteUrl(evolution_id[0], evolution_id[1], "R", 0);
  const url_R_1 = getSpriteUrl(evolution_id[0], evolution_id[1], "R", 1);
  const url_L_0 = getSpriteUrl(evolution_id[0], evolution_id[1], "L", 0);
  const url_L_1 = getSpriteUrl(evolution_id[0], evolution_id[1], "L", 1);

  // Check which URLs actually exist in the sprite map
  const actualUrl_F_0 = spriteUrlMap[url_F_0];
  const actualUrl_F_1 = spriteUrlMap[url_F_1];
  const actualUrl_U_0 = spriteUrlMap[url_U_0];
  const actualUrl_U_1 = spriteUrlMap[url_U_1];
  const actualUrl_R_0 = spriteUrlMap[url_R_0];
  const actualUrl_R_1 = spriteUrlMap[url_R_1];
  const actualUrl_L_0 = spriteUrlMap[url_L_0];
  const actualUrl_L_1 = spriteUrlMap[url_L_1];

  console.log("🎨 SpriteAnimator DEBUG:");
  console.log("  evolution_id:", evolution_id, "isEgg:", isEgg, "actualDirection:", actualDirection);
  console.log("  Generated URLs:");
  console.log("    F_0:", url_F_0, "exists:", !!actualUrl_F_0);
  console.log("    F_1:", url_F_1, "exists:", !!actualUrl_F_1);
  console.log("  Actual URLs:");
  console.log("    F_0:", actualUrl_F_0);
  console.log("    F_1:", actualUrl_F_1);

  // Always load F textures (required for all pets)
  const textures_F = useTexture([actualUrl_F_0, actualUrl_F_1]);
  
  // For other directions, use F as fallback if they don't exist
  const textures_U = useTexture([
    actualUrl_U_0 || actualUrl_F_0, 
    actualUrl_U_1 || actualUrl_F_1
  ]);
  const textures_R = useTexture([
    actualUrl_R_0 || actualUrl_F_0, 
    actualUrl_R_1 || actualUrl_F_1
  ]);
  const textures_L = useTexture([
    actualUrl_L_0 || actualUrl_F_0, 
    actualUrl_L_1 || actualUrl_F_1
  ]);

  // Set texture filters for crisp pixel art.
  const allTextures = [...textures_F, ...textures_U, ...textures_R, ...textures_L];
  allTextures.forEach((tex) => {
    if (tex) {
      tex.minFilter = THREE.NearestFilter;
      tex.magFilter = THREE.NearestFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
    }
  });

  // Organize textures by direction.
  const textures = {
    F: textures_F,
    U: textures_U,
    R: textures_R,
    L: textures_L,
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

