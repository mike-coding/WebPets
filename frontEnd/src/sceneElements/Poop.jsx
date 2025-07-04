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
  const [isSplatting, setIsSplatting] = useState(false);
  const [splatProgress, setSplatProgress] = useState(0);
  const [impactPosition, setImpactPosition] = useState(null); // Store where poop lands
  const spriteRef = useRef();
  const stenchParticlesRef = useRef();
  const splatParticlesRef = useRef();
  
  const CLEANUP_DURATION = 1300; // Increased duration for fling animation
  const SPLAT_DURATION = 600; // Duration of splat particle explosion
  
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
  const originalTexture = useTexture(actualUrl || fallbackUrl);
  
  // Clone the texture so each poop can rotate independently
  const texture = useMemo(() => {
    if (!originalTexture) return null;
    const clonedTexture = originalTexture.clone();
    clonedTexture.needsUpdate = true;
    return clonedTexture;
  }, [originalTexture]);
  
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

  // Create splat particles for explosion effect
  const splatParticles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      particles.push({
        id: i,
        direction: {
          x: Math.cos(angle) * (0.5 + Math.random() * 0.5),
          y: Math.sin(angle) * (0.5 + Math.random() * 0.5),
          z: Math.random() * 0.3 + 0.1
        },
        size: 0.075 + Math.random() * 0.03,
        life: Math.random() * 0.2 + 0.1, // 0.7 to 1.0
      });
    }
    return particles;
  }, []);

  // Set texture filters for crisp pixel art
  if (texture) {
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    
    // Set up texture for rotation - center the rotation point
    texture.center.set(0.5, 0.5);
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
    
    // Animate stench particles (only when not cleaning up or splatting)
    if (!isCleaningUp && !isSplatting && stenchParticlesRef.current) {
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
    
    // Splat particle animation
    if (isSplatting && splatParticlesRef.current && impactPosition) {
      const newSplatProgress = splatProgress + (delta * 1000);
      setSplatProgress(newSplatProgress);
      
      const splatRatio = Math.min(newSplatProgress / SPLAT_DURATION, 1);
      
      splatParticles.forEach((particle, index) => {
        const child = splatParticlesRef.current.children[index];
        if (child) {
          // Particle trajectory with gravity
          const t = splatRatio;
          const gravity = -2;
          
          const x = impactPosition[0] + particle.direction.x * t * 2;
          const y = impactPosition[1] + particle.direction.y * t * 2;
          const z = particle.direction.z * t + gravity * t * t;
          
          child.position.set(x, y, Math.max(0, z));
          
          // Fade out over time based on particle life
          const lifeProgress = t / particle.life;
          const opacity = Math.max(0, 1 - lifeProgress);
          child.material.opacity = opacity;
          
          // Scale shrinks over time
          const scale = particle.size * (1 - t * 0.5);
          child.scale.set(scale, scale, scale);
        }
      });
      
      // End splat animation and delete poop
      if (splatRatio >= 1) {
        console.log(`💥 Splat complete for poop ${poopId} - deleting from database`);
        deleteHomeObject(poopId);
      }
      
      return; // Skip cleanup animation if splatting
    }
    
    // Cleanup animation
    if (!isCleaningUp || !spriteRef.current) return;
    
    const newProgress = cleanupProgress + (delta * 1000); // Convert to ms
    setCleanupProgress(newProgress);
    
    // Enhanced cleanup animation: fling off-screen with physics
    // Remove the time clamp - let physics run freely until ground impact
    const t = newProgress / CLEANUP_DURATION; // No Math.min clamp!
    const gravity = -9.8;
    
    // Position calculation with gravity
    const x = position[0] + flingDirection.x * t;
    const y = position[1];
    const z = position[2] + flingDirection.y * t + 2 * gravity * t * t;
  
    
    // Crazy spinning
    const rotation = t * flingDirection.rotation;
  
    
    // Apply transformations
    spriteRef.current.position.set(x, y, z);
    
    // Apply rotation to the texture instead of the sprite
    if (texture) {
      texture.rotation = rotation;
      texture.needsUpdate = true;
    }
    
    // Check if poop hits the ground (z <= 0) and trigger splat
    if (z <= 0 && !isSplatting) {
      console.log(`💥 Poop ${poopId} hit the ground - triggering splat!`);
      setIsSplatting(true);
      setSplatProgress(0);
      setImpactPosition([x, y, 0]); // Store the impact position
      
      // Hide main sprite and stench particles
      spriteRef.current.visible = false;
      if (stenchParticlesRef.current) {
        stenchParticlesRef.current.visible = false;
      }
      return;
    }
    
    // Hide stench particles during cleanup flight
    if (stenchParticlesRef.current) {
      stenchParticlesRef.current.visible = false;
    }
    
    // Don't delete based on time - let it fall and hit the ground naturally
    // The splat detection will handle the deletion when z <= 0
  });

  return (
    <group>
      {/* Main poop sprite with texture rotation */}
      <sprite 
        ref={spriteRef}
        position={position} 
        scale={[0.5, 0.5, 0.5]}
        onClick={handleCleanup}
      >
        <spriteMaterial attach="material" map={texture} transparent />
      </sprite>
      
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

      {/* Splat particles for explosion effect - only render when splatting */}
      {isSplatting && (
        <group ref={splatParticlesRef}>
          {splatParticles.map((particle) => (
            <sprite key={particle.id}>
              <spriteMaterial 
                attach="material" 
                color="#45240c" // Brown splat color
                transparent 
                opacity={1}
              />
            </sprite>
          ))}
        </group>
      )}
    </group>
  );
}
