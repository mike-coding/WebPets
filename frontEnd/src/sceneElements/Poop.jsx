import React, { useState, useRef, useMemo } from "react";
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
  const { deleteHomeObject } = useUserDataContext();
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [cleanupProgress, setCleanupProgress] = useState(0);
  const spriteRef = useRef();
  const stenchParticlesRef = useRef();
  
  const CLEANUP_DURATION = 1300; // Increased duration for fling animation
  
  // Random fling direction for cleanup animation
  const flingDirection = useMemo(() => ({
    x: (Math.random() - 0.5) * 10, // Random horizontal fling
    y: Math.random() * 5 + 20,     // Upward fling with some randomness
    rotation: (Math.random() - 0.5) * Math.PI * 20, // Random spin direction
  }), []);
  // Generate URL for the poop sprite
  const url = getPoopSpriteUrl(size);
  const actualUrl = poopSpriteUrlMap[url];

  // Load the texture, fallback to small poop if size doesn't exist
  const fallbackUrl = poopSpriteUrlMap[getPoopSpriteUrl('s')];
  const texture = useTexture(actualUrl || fallbackUrl);
  
  // Create stench particles
  const stenchParticles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < 7; i++) {
      particles.push({
        id: i,
        offset: Math.random() * Math.PI * 2, // Random phase offset
        radius: 0.02 + Math.random() * 0.02,   // Random radius
        speed: 0.15 + Math.random() * 0.15,    // Random float speed
      });
    }
    return particles;
  }, []);

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

  // Animation loop for stench particles and cleanup effect
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Animate stench particles (always running unless cleaning up)
    if (!isCleaningUp && stenchParticlesRef.current) {
      stenchParticles.forEach((particle, index) => {
        const child = stenchParticlesRef.current.children[index];
        if (child) {
          // Floating motion with sine wave
          const floatY = Math.sin(time * particle.speed + particle.offset) * 0.1 + 0.22;
          const floatX = Math.sin(time * particle.speed * 0.7 + particle.offset) * 0.12;
          
          child.position.set(
            floatX,
            floatY,
            0
          );
          
          // Fade in and out
          const fadePhase = (time * 2 + particle.offset) % (Math.PI * 2);
          const opacity = (Math.sin(fadePhase) + 1) * 0.3; // 0 to 0.6 opacity
          child.material.opacity = opacity;
          
          // Scale pulsing
          const scale = 0.05 + Math.sin(time * 3 + particle.offset) * 0.02;
          child.scale.set(scale, scale, scale);
        }
      });
    }
    
    // Cleanup animation
    if (!isCleaningUp || !spriteRef.current) return;
    
    const newProgress = cleanupProgress + (delta * 1000); // Convert to ms
    setCleanupProgress(newProgress);
    
    // Enhanced cleanup animation: fling off-screen with physics
    const progressRatio = Math.min(newProgress / CLEANUP_DURATION, 1);
    
    // Physics-based trajectory (parabolic motion)
    const t = progressRatio;
    const gravity = -9.8;
    
    // Position calculation with gravity
    const x = position[0] + flingDirection.x * t;
    const y = position[1];
    const z = position[2] + flingDirection.y * t + 2 * gravity * t * t;
  
    
    // Crazy spinning
    const rotation = progressRatio * flingDirection.rotation;
  
    
    // Apply transformations
    spriteRef.current.position.set(x, y, z);
    spriteRef.current.rotation.z = rotation;
    
    // Hide stench particles during cleanup
    if (stenchParticlesRef.current) {
      stenchParticlesRef.current.visible = false;
    }
    
    // Remove poop when animation completes
    if (progressRatio >= 1) {
      console.log(`✨ Cleanup complete for poop ${poopId} - deleting from database`);
      deleteHomeObject(poopId);
    }
  });

  return (
    <group>
      {/* Main poop sprite - use mesh during cleanup for rotation, sprite otherwise */}
      {isCleaningUp ? (
        <mesh 
          ref={spriteRef}
          position={position} 
          onClick={handleCleanup}
        >
          <planeGeometry args={[0.6, 0.6]} />
          <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
        </mesh>
      ) : (
        <sprite 
          ref={spriteRef}
          position={position} 
          scale={[0.5, 0.5, 0.5]}
          onClick={handleCleanup}
        >
          <spriteMaterial attach="material" map={texture} transparent />
        </sprite>
      )}
      
      {/* Stench particles */}
      <group ref={stenchParticlesRef} position={position}>
        {stenchParticles.map((particle) => (
          <sprite key={particle.id}>
            <spriteMaterial 
              attach="material" 
              color="#5b7542" // Light green stench color
              transparent 
              opacity={1}
            />
          </sprite>
        ))}
      </group>
    </group>
  );
}
