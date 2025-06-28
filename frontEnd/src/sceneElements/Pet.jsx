import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";
import * as THREE from "three";
import SpriteAnimator from "./SpriteAnimator.jsx";
import { useNavigationContext, useUserDataContext } from "../hooks/AppContext";

export default function Pet({ petInfo, bounds = { x: [-8, 8], y: [-6, 6] } }) {
  const groupRef = useRef();
  const { navigateTo } = useNavigationContext();
  const { updatePetData } = useUserDataContext();
  const fixedZ = 0.2;
  const speed = 2;
  const egg_incubation_minutes = 5;
  const [target, setTarget] = useState(new THREE.Vector2());
  const [direction, setDirection] = useState("F");
  
  // Track if we've already checked for hatching to avoid repeated checks
  const hasCheckedHatching = useRef(false);
  const handleClick = (event) => {
    event.stopPropagation();
    navigateTo("petSummary", null, petInfo.id);
  };

  // Check if egg should hatch (age > 1 minute = 60000ms)
  const checkForHatching = () => {
    if (hasCheckedHatching.current) return; // Already checked this frame cycle
    
    const isEgg = petInfo.evolution_id[0] === 0;
    if (!isEgg) return; // Not an egg, no need to check
    
    const now = Date.now();
    const ageMs = now - petInfo.createdAt;
    const incubation_ms = egg_incubation_minutes * 60000; // 60000ms = 1 minute
    
    if (ageMs > incubation_ms) {
      console.log(`🥚➡️🐾 HATCHING! Pet ${petInfo.id} (age: ${ageMs}ms)`);
      
      // Hatch the egg by changing evolution_id[0] from 0 to 1
      const newEvolutionId = [1, petInfo.evolution_id[1]];
      updatePetData(petInfo.id, { evolution_id: newEvolutionId });
      
      hasCheckedHatching.current = true; // Mark as checked
    }
  };

  // Initialize position once on mount
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(0, 0, fixedZ);
    }
  }, []); // Only run once on mount

  const deltaRef = useRef(0);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.1);
    deltaRef.current = clampedDelta;
    
    // Check for hatching on every frame (but only process once per pet)
    checkForHatching();
    
    if (petInfo.evolution_id[0] === 0) return;
    if (!groupRef.current) return;

    const pos = groupRef.current.position;
    const currentXY = new THREE.Vector2(pos.x, pos.y);
    const toTarget = new THREE.Vector2().subVectors(target, currentXY);
    const distance = toTarget.length();

    if (Math.abs(toTarget.x) > Math.abs(toTarget.y)) {
      setDirection(toTarget.x < 0 ? "L" : "R");
    } else {
      setDirection(toTarget.y > 0 ? "U" : "F");
    }

    if (distance < 0.1) {
      const offset = new THREE.Vector2(
        THREE.MathUtils.randFloatSpread(6),
        THREE.MathUtils.randFloatSpread(6)
      );
      if (offset.length() > 3) offset.setLength(3);
      const newX = THREE.MathUtils.clamp(
        currentXY.x + offset.x,
        bounds.x[0],
        bounds.x[1]
      );
      const newY = THREE.MathUtils.clamp(
        currentXY.y + offset.y,
        bounds.y[0],
        bounds.y[1]
      );
      setTarget(new THREE.Vector2(newX, newY));
    } else {
      toTarget.normalize();
      let scaledSpeed = speed * (distance / 3);
      scaledSpeed = Math.min(scaledSpeed, speed);
      currentXY.add(toTarget.multiplyScalar(scaledSpeed * clampedDelta));
      groupRef.current.position.set(currentXY.x, currentXY.y, fixedZ);
    }
  });
  console.log("Pet render", performance.now(), "petInfo:", petInfo);
  console.log("  Pet evolution_id:", petInfo.evolution_id, "id:", petInfo.id);
  return (
    <group ref={groupRef} onClick={handleClick}>
      <Billboard follow={true}>
        <SpriteAnimator
          evolution_id={petInfo.evolution_id}
          direction={direction}
          flipInterval={0.5}
        />
      </Billboard>
    </group>
  );
}

