import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import React, { useMemo } from "react";

/**
 * Creates a texture atlas by drawing a grid of tiles onto a canvas.
 * Each tile is drawn by randomly selecting one of the candidate textures.
 * If showCheckered is true, every other tile is tinted slightly dark-blue.
 *
 * @param {Array<THREE.Texture>} candidateTextures - Array of candidate textures.
 * @param {Object} options - Options: patternWidth, patternHeight, tileSize, showCheckered.
 * @returns {THREE.CanvasTexture} The generated atlas texture.
 */
function createRandomAtlas(candidateTextures, { patternWidth, patternHeight, tileSize, showCheckered }) {
  const canvas = document.createElement("canvas");
  canvas.width = patternWidth * tileSize;
  canvas.height = patternHeight * tileSize;
  const ctx = canvas.getContext("2d");

  // For each cell in our grid, draw a random candidate image.
  for (let y = 0; y < patternHeight; y++) {
    for (let x = 0; x < patternWidth; x++) {
      const posX = x * tileSize;
      const posY = y * tileSize;
      // Choose a candidate at random.
      const idx = Math.floor(Math.random() * candidateTextures.length);
      const img = candidateTextures[idx].image;
      // Draw the candidate image (assumes candidate textures are loaded and are same size as tileSize)
      ctx.drawImage(img, posX, posY, tileSize, tileSize);
      // If checkered effect is enabled and this cell qualifies, overlay a dark-blue tint.
      if (showCheckered && ((x + y) % 2 === 1)) {
        ctx.fillStyle = "rgba(0, 0, 64, 0.04)"; // adjust tint as desired
        ctx.fillRect(posX, posY, tileSize, tileSize);
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function TiledGround({ patternWidth, patternHeight, showGrid = false, showCheckered = true }) {
  // Candidate texture URLs.
  const textureUrls = [
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/0.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/1.png",
    "/sprites/tiles/grass/7.png",
    "/sprites/tiles/grass/8.png",
    "/sprites/tiles/grass/7.png",
    "/sprites/tiles/grass/8.png",
    "/sprites/tiles/grass/7.png",
    "/sprites/tiles/grass/8.png",
    "/sprites/tiles/grass/7.png",
    "/sprites/tiles/grass/8.png",
    "/sprites/tiles/grass/7.png",
    "/sprites/tiles/grass/8.png",
    "/sprites/tiles/grass/7.png",
    "/sprites/tiles/grass/8.png",
    "/sprites/tiles/grass/9.png",
    "/sprites/tiles/grass/10.png",
    "/sprites/tiles/grass/13.png",
    "/sprites/tiles/grass/13.png",
    "/sprites/tiles/grass/13.png",
    "/sprites/tiles/grass/13.png",
    "/sprites/tiles/grass/13.png",
    "/sprites/tiles/grass/13.png",
    "/sprites/tiles/grass/13.png",
    "/sprites/tiles/grass/13.png",
    "/sprites/tiles/grass/16.png",
    "/sprites/tiles/grass/19.png",
    "/sprites/tiles/grass/19.png",
    "/sprites/tiles/grass/19.png",
    "/sprites/tiles/grass/19.png",
    "/sprites/tiles/grass/19.png",
    "/sprites/tiles/grass/19.png",
    "/sprites/tiles/grass/19.png",
    "/sprites/tiles/grass/22.png",
    "/sprites/tiles/grass/25.png",
    "/sprites/tiles/grass/25.png",
    "/sprites/tiles/grass/25.png",
    "/sprites/tiles/grass/25.png",
    "/sprites/tiles/grass/25.png",
    "/sprites/tiles/grass/25.png",
    "/sprites/tiles/grass/25.png",
    "/sprites/tiles/grass/26.png",
    "/sprites/tiles/grass/27.png",
    "/sprites/tiles/grass/28.png",
  ];

  // Load candidate textures. useTexture can accept an array of URLs.
  const candidateTextures = useTexture(textureUrls);
  // Configure each candidate texture.
  candidateTextures.forEach(tex => {
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
  });

  // Build our atlas texture via a memoized function.
  // We'll assume each candidate texture is 32×32 pixels.
  const tileSize = 32;
  const atlasTexture = useMemo(() => {
    if (!candidateTextures || candidateTextures.length === 0) return null;
    const tex = createRandomAtlas(candidateTextures, { patternWidth, patternHeight, tileSize, showCheckered });
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    tex.repeat.set(1, 1);
    return tex;
  }, [candidateTextures, showCheckered]);

  return (
    <>
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[patternWidth, patternHeight]} />
        <meshStandardMaterial
          map={atlasTexture}
          color="#ffffff"
          receiveShadow
        />
      </mesh>
      {showGrid && (
        <primitive
          object={new THREE.GridHelper(patternWidth, patternHeight, "#bfbfbf", "#bfbfbf")}
          position={[0, 0, 0.01]}
          rotation={[0, 0, 0]}
        />
      )}
    </>
  );
}

export default TiledGround;


