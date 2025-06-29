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
  const speed = 0.6;
  const egg_incubation_minutes = 5;
  
  // Movement behavior constants
  const MIN_SPEED_THRESHOLD = 0.0001;      // Speed below which we pick new direction
  const NEW_DIRECTION_SPREAD = Math.PI;  // Angular spread for new directions (radians)
  const EASING_POWER = 3;                // Cubic easing for smooth deceleration
  const PROGRESS_RATE = 0.01;            // How fast progress advances per frame (0.01 = slow, 0.05 = fast)
  
  const [direction, setDirection] = useState("F");
  const [movementDirection, setMovementDirection] = useState(new THREE.Vector2(1, 0)); // Unit vector
  const [movementProgress, setMovementProgress] = useState(0); // 0 to 1 progress through current movement
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  
  // Degradation constants
  const HUNGER_DEGRADATION_PER_HOUR = 0.1;    // Hunger increases by 0.1 per hour
  const HAPPINESS_DEGRADATION_PER_HOUR = 0.05; // Happiness decreases by 0.05 per hour
  const DEGRADATION_UPDATE_INTERVAL = 30000;   // Update every 30 seconds
  
  // Track if we've already checked for hatching to avoid repeated checks
  const hasCheckedHatching = useRef(false);
  
  // Track last degradation time for real-time updates
  const lastDegradationTime = useRef(null);
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
      // Hatch the egg by changing evolution_id[0] from 0 to 1
      const newEvolutionId = [1, petInfo.evolution_id[1]];
      updatePetData(petInfo.id, { evolution_id: newEvolutionId });
      
      hasCheckedHatching.current = true; // Mark as checked
    }
  };

  // Handle degradation logic
  const handleDegradation = () => {
    const currentTime = Date.now();
    
    if (petInfo.lastUpdate) {
      // Initialize lastDegradationTime from server data on first run
      if (lastDegradationTime.current === null) {
        lastDegradationTime.current = petInfo.lastUpdate;
      }
      
      const timeSinceLastDegradation = currentTime - lastDegradationTime.current;
      
      // Apply degradation every 30 seconds for reasonable real-time updates
      if (timeSinceLastDegradation > DEGRADATION_UPDATE_INTERVAL) {
        const timeElapsedMs = timeSinceLastDegradation;
        const hoursElapsed = timeElapsedMs / (1000 * 60 * 60);
        
        const hungerIncrease = HUNGER_DEGRADATION_PER_HOUR * hoursElapsed;
        const happinessDecrease = HAPPINESS_DEGRADATION_PER_HOUR * hoursElapsed;
        
        const newHunger = Math.min(1.0, petInfo.hunger + hungerIncrease);
        const newHappiness = Math.max(0.0, petInfo.happiness - happinessDecrease);
        
        console.log(`Pet ${petInfo.id}: Degradation update - ${hoursElapsed.toFixed(3)} hours elapsed - Hunger: ${petInfo.hunger.toFixed(3)} -> ${newHunger.toFixed(3)}, Happiness: ${petInfo.happiness.toFixed(3)} -> ${newHappiness.toFixed(3)}`);
        
        updatePetData(petInfo.id, {
          hunger: newHunger,
          happiness: newHappiness,
          lastUpdate: currentTime
        });
        
        lastDegradationTime.current = currentTime;
      }
    } else {
      // Initialize lastUpdate if not set
      updatePetData(petInfo.id, { lastUpdate: currentTime });
      lastDegradationTime.current = currentTime;
    }
  };

  // Handle pet movement logic
  const handleMovement = (clampedDelta) => {
    if (!groupRef.current) return;

    const pos = groupRef.current.position;
    const currentXY = new THREE.Vector2(pos.x, pos.y);
    
    // Advance movement progress each frame
    const newProgress = Math.min(movementProgress + PROGRESS_RATE, 1.0);
    setMovementProgress(newProgress);
    
    // Calculate speed using cubic easing curve (starts at full speed, curves down to 0)
    const speedMultiplier = Math.pow(1 - newProgress, EASING_POWER);
    const newSpeed = speed * speedMultiplier;
    setCurrentSpeed(newSpeed);
    
    // Check if we should pick a new direction
    if (newSpeed < MIN_SPEED_THRESHOLD) {
      // Pick new random direction and reset progress
      const baseAngle = Math.atan2(movementDirection.y, movementDirection.x);
      const angleOffset = (Math.random() - 0.5) * NEW_DIRECTION_SPREAD;
      const newAngle = baseAngle + angleOffset;
      const newDirection = new THREE.Vector2(Math.cos(newAngle), Math.sin(newAngle));
      
      setMovementDirection(newDirection);
      setMovementProgress(0); // Reset movement progress
    } else {
      // Move in current direction
      const velocity = movementDirection.clone().multiplyScalar(newSpeed * clampedDelta);
      const newPos = currentXY.add(velocity);
      
      // Clamp to bounds and handle bouncing
      let bounced = false;
      if (newPos.x < bounds.x[0] || newPos.x > bounds.x[1]) {
        setMovementDirection(new THREE.Vector2(-movementDirection.x, movementDirection.y));
        newPos.x = THREE.MathUtils.clamp(newPos.x, bounds.x[0], bounds.x[1]);
        bounced = true;
      }
      if (newPos.y < bounds.y[0] || newPos.y > bounds.y[1]) {
        setMovementDirection(new THREE.Vector2(movementDirection.x, -movementDirection.y));
        newPos.y = THREE.MathUtils.clamp(newPos.y, bounds.y[0], bounds.y[1]);
        bounced = true;
      }
      
      groupRef.current.position.set(newPos.x, newPos.y, fixedZ);
    }
    
    // Update sprite direction based on movement direction
    if (Math.abs(movementDirection.x) > Math.abs(movementDirection.y)) {
      setDirection(movementDirection.x < 0 ? "L" : "R");
    } else {
      setDirection(movementDirection.y > 0 ? "U" : "F");
    }
  };

  // Initialize position and first movement direction
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(0, 0, fixedZ);
      // Start with random direction
      const angle = Math.random() * Math.PI * 2;
      setMovementDirection(new THREE.Vector2(Math.cos(angle), Math.sin(angle)));
    }
  }, []); // Only run once on mount

  const deltaRef = useRef(0);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.1);
    
    // Check for hatching on every frame (but only process once per pet)
    checkForHatching();
    
    // Handle degradation logic
    handleDegradation();
    
    // Skip movement for eggs
    if (petInfo.evolution_id[0] === 0) return;
    
    // Handle pet movement
    handleMovement(clampedDelta);
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

