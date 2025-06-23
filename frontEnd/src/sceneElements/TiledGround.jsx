import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import React, { useMemo } from "react";

// 1. Import all tile images using import.meta.glob
const tileModules = import.meta.glob('/src/sprites/tiles/grass/*.png', { eager: true });
const tileUrlMap = Object.fromEntries(
  Object.entries(tileModules).map(([path, mod]) => {
    // Extract the filename (e.g., "0.png")
    const fileName = path.split('/').pop();
    return [fileName, mod.default];
  })
);

function createRandomAtlas(candidateTextures, { patternWidth, patternHeight, tileSize, showCheckered }) {
  const canvas = document.createElement("canvas");
  canvas.width = patternWidth * tileSize;
  canvas.height = patternHeight * tileSize;
  const ctx = canvas.getContext("2d");

  // For each cell in grid, draw a random candidate image.
  for (let y = 0; y < patternHeight; y++) {
    for (let x = 0; x < patternWidth; x++) {
      const posX = x * tileSize;
      const posY = y * tileSize;
      const idx = Math.floor(Math.random() * candidateTextures.length);
      const img = candidateTextures[idx].image;
      ctx.drawImage(img, posX, posY, tileSize, tileSize);
      if (showCheckered && ((x + y) % 2 === 1)) {
        ctx.fillStyle = "rgba(0, 0, 64, 0.04)";
        ctx.fillRect(posX, posY, tileSize, tileSize);
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

const TiledGround = React.memo(function TiledGround({ patternWidth, patternHeight, showGrid = false, showCheckered = true }) {
  // 2. Use the imported URLs instead of relative paths
  const textureFileNames = [
    "0.png","0.png","0.png","0.png","0.png","0.png","0.png","0.png","0.png","0.png","0.png",
    "1.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png",
    "0.png","0.png","0.png","0.png","0.png","0.png","0.png","0.png","0.png","0.png",
    "0.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png",
    "1.png","0.png","0.png","0.png","0.png","0.png","0.png","0.png","0.png","0.png",
    "0.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png",
    "0.png","0.png","0.png","0.png","0.png","0.png","0.png","0.png","0.png","0.png",
    "0.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png","1.png",
    "7.png","8.png","7.png","8.png","7.png","8.png","7.png","8.png","7.png","8.png",
    "7.png","8.png","9.png","10.png","13.png","13.png","13.png","13.png","13.png","13.png",
    "13.png","13.png","16.png","19.png","19.png","19.png","19.png","19.png","19.png","19.png",
    "22.png","25.png","25.png","25.png","25.png","25.png","25.png","25.png","26.png","27.png","28.png"
  ];

  // Map file names to URLs using the tileUrlMap
  const textureUrls = textureFileNames.map(name => tileUrlMap[name]);

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
});

export default TiledGround;


