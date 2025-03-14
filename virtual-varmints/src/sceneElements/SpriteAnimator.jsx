import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function SpriteAnimator({ evolution_id, direction, flipInterval = 0.5 }) {
  const isEgg = evolution_id[0] === 0;
  // For eggs, always use "F"
  const actualDirection = isEgg ? "F" : direction;

  // Load F textures (always needed)
  const texture_F_0 = useTexture(`../src/sprites/varmints/${evolution_id[0]}/${evolution_id[1]}/F/0.png`);
  const texture_F_1 = useTexture(`../src/sprites/varmints/${evolution_id[0]}/${evolution_id[1]}/F/1.png`);
  const texturesF = [texture_F_0, texture_F_1];

  let texturesU, texturesR, texturesL;
  if (!isEgg) {
    // Load additional directions only if not an egg
    const texture_U_0 = useTexture(`../src/sprites/varmints/${evolution_id[0]}/${evolution_id[1]}/U/0.png`);
    const texture_U_1 = useTexture(`../src/sprites/varmints/${evolution_id[0]}/${evolution_id[1]}/U/1.png`);
    texturesU = [texture_U_0, texture_U_1];

    const texture_R_0 = useTexture(`../src/sprites/varmints/${evolution_id[0]}/${evolution_id[1]}/R/0.png`);
    const texture_R_1 = useTexture(`../src/sprites/varmints/${evolution_id[0]}/${evolution_id[1]}/R/1.png`);
    texturesR = [texture_R_0, texture_R_1];

    const texture_L_0 = useTexture(`../src/sprites/varmints/${evolution_id[0]}/${evolution_id[1]}/L/0.png`);
    const texture_L_1 = useTexture(`../src/sprites/varmints/${evolution_id[0]}/${evolution_id[1]}/L/1.png`);
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
  });

  return (
    <sprite>
      <spriteMaterial attach="material" map={textures[actualDirection][frameIndex]} transparent />
    </sprite>
  );
}

