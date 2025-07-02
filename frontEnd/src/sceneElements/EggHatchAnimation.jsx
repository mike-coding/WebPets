import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import SpriteAnimator from './SpriteAnimator.jsx';

export default function EggHatchAnimation({ 
  petInfo, 
  direction, 
  hatchAnimationProgress, 
  HATCH_ANIMATION_DURATION 
}) {
  // Load hatch animation textures
  const leftShellTexture = useTexture(`/src/sprites/pets/0/${petInfo.evolution_id[1]}/__0.png`);
  const rightShellTexture = useTexture(`/src/sprites/pets/0/${petInfo.evolution_id[1]}/__1.png`);
  
  // Set texture filters for crisp pixel art
  [leftShellTexture, rightShellTexture].forEach((tex) => {
    if (tex) {
      tex.minFilter = THREE.NearestFilter;
      tex.magFilter = THREE.NearestFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
    }
  });

  return (
    <>
      {/* Left eggshell half */}
      <sprite 
        position={[
          -hatchAnimationProgress * 0.001, // Move left as time progresses
          0,
          0
        ]}
        scale={[1, 1, 1]}
      >
        <spriteMaterial 
          attach="material"
          map={leftShellTexture}
          transparent={true}
          opacity={Math.max(0, 1 - (hatchAnimationProgress / HATCH_ANIMATION_DURATION))}
        />
      </sprite>
      
      {/* Right eggshell half */}
      <sprite 
        position={[
          hatchAnimationProgress * 0.001, // Move right as time progresses
          0,
          0
        ]}
        scale={[1, 1, 1]}
      >
        <spriteMaterial 
          attach="material"
          map={rightShellTexture}
          transparent={true}
          opacity={Math.max(0, 1 - (hatchAnimationProgress / HATCH_ANIMATION_DURATION))}
        />
      </sprite>
      
      {/* Show the hatched pet behind the shells */}
      <SpriteAnimator
        evolution_id={[1, petInfo.evolution_id[1]]} // Show the hatched version
        direction={direction}
        flipInterval={0.5}
      />
    </>
  );
}
