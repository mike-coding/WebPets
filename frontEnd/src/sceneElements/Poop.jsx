import React from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// Sprite modules for poop textures
const poopSpriteModules = import.meta.glob('/src/sprites/entity_other/poo_*.png', { eager: true });
const poopSpriteUrlMap = {};
for (const [path, mod] of Object.entries(poopSpriteModules)) {
  // path: '/src/sprites/entity_other/poo_s.png'
  poopSpriteUrlMap[path] = mod.default;
}

// Helper to get the correct poop sprite URL
function getPoopSpriteUrl(size) {
  return `/src/sprites/entity_other/poo_${size}.png`;
}

export default function Poop({ size = 's', position = [0, 0, 0], onClick }) {
  // Generate URL for the poop sprite
  const url = getPoopSpriteUrl(size);
  const actualUrl = poopSpriteUrlMap[url];

  console.log("💩 Poop DEBUG:");
  console.log("  size:", size);
  console.log("  Generated URL:", url);
  console.log("  exists:", !!actualUrl);
  console.log("  Actual URL:", actualUrl);

  // Load the texture, fallback to small poop if size doesn't exist
  const fallbackUrl = poopSpriteUrlMap[getPoopSpriteUrl('s')];
  const texture = useTexture(actualUrl || fallbackUrl);

  // Set texture filters for crisp pixel art
  if (texture) {
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  return (
    <sprite 
      position={position} 
      scale={[0.5, 0.5, 0.5]}
      onClick={onClick}
    >
      <spriteMaterial attach="material" map={texture} transparent />
    </sprite>
  );
}
