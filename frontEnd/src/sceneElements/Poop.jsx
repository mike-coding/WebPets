import React, { useState, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useUserDataContext } from "../hooks/AppContext";

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

export default function Poop({ size = 's', position = [0, 0, 0], poopId }) {
  const { userData, updateUserData } = useUserDataContext();
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [cleanupProgress, setCleanupProgress] = useState(0);
  const spriteRef = useRef();
  
  const CLEANUP_DURATION = 800; // Animation duration in milliseconds
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

  // Handle cleanup animation and removal
  const handleCleanup = (e) => {
    e.stopPropagation();
    
    if (isCleaningUp) return; // Prevent double-clicks
    
    console.log(`🧹 Starting cleanup of poop ${poopId}`);
    setIsCleaningUp(true);
    setCleanupProgress(0);
  };

  // Animation loop for cleanup effect
  useFrame((state, delta) => {
    if (!isCleaningUp || !spriteRef.current) return;
    
    const newProgress = cleanupProgress + (delta * 1000); // Convert to ms
    setCleanupProgress(newProgress);
    
    // Cleanup animation: shrink, spin, and fade
    const progressRatio = Math.min(newProgress / CLEANUP_DURATION, 1);
    const scale = 0.5 * (1 - progressRatio); // Shrink from 0.5 to 0
    const rotation = progressRatio * Math.PI * 4; // 4 full rotations
    const opacity = 1 - progressRatio; // Fade out
    
    // Apply transformations
    spriteRef.current.scale.set(scale, scale, scale);
    spriteRef.current.rotation.z = rotation;
    spriteRef.current.material.opacity = opacity;
    
    // Remove poop when animation completes
    if (progressRatio >= 1) {
      console.log(`✨ Cleanup complete for poop ${poopId} - removing from database`);
      
      // Remove from userData.home_objects
      const updatedHomeObjects = userData.home_objects.filter(obj => obj.id !== poopId);
      updateUserData({ home_objects: updatedHomeObjects });
    }
  });

  return (
    <sprite 
      ref={spriteRef}
      position={position} 
      scale={[0.5, 0.5, 0.5]}
      onClick={handleCleanup}
    >
      <spriteMaterial attach="material" map={texture} transparent />
    </sprite>
  );
}
