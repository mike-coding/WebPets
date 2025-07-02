import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import SpriteAnimator from "./SpriteAnimator.jsx";
import EggHatchAnimation from "./EggHatchAnimation.jsx";
import Poop from "./Poop.jsx";
import { useNavigationContext, useUserDataContext } from "../hooks/AppContext";

export default function Pet({ petInfo, bounds = { x: [-8, 8], y: [-6, 6] } }) {
  const groupRef = useRef();
  const { navigateTo } = useNavigationContext();
  const { userData, updateUserData } = useUserDataContext();
  const fixedZ = 0.2;
  const speed = 0.8;
  const egg_incubation_minutes = 0.1;
  
  // Constants
  const DELTA_CLAMP = 0.1;
  const MS_TO_HOURS = 1000 * 60 * 60;
  const MS_PER_MINUTE = 60000;
  
  // Movement behavior constants
  const MIN_SPEED_THRESHOLD = 0.0001;    // Speed below which we pick new direction
  const NEW_DIRECTION_SPREAD = Math.PI;  // Angular spread for new directions (radians)
  const EASING_POWER = 3;                // Cubic easing for smooth deceleration
  const PROGRESS_RATE = 0.01;            // How fast progress advances per frame (0.01 = slow, 0.05 = fast)
  const WAIT_TIME_RANGE = 2000;          // Max wait time in MS after stopping (0 to this value)
  
  const [direction, setDirection] = useState("F");
  const [movementDirection, setMovementDirection] = useState(new THREE.Vector2(1, 0)); // Unit vector
  const [movementProgress, setMovementProgress] = useState(0); // 0 to 1 progress through current movement
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [waitUntil, setWaitUntil] = useState(0); // Timestamp when pet should start moving again
  
  // Degradation constants
  const HUNGER_DEGRADATION_PER_HOUR = 0.1;     // Hunger increases by 0.1 per hour
  const HAPPINESS_DEGRADATION_PER_HOUR = 0.025; // Happiness decreases by 0.05 per hour
  const DEGRADATION_UPDATE_INTERVAL = 30000;   // Update every 30 seconds
  
  // Track if we've already checked for hatching to avoid repeated checks
  const hasCheckedHatching = useRef(false);
  
  // Hatch animation state
  const [isHatching, setIsHatching] = useState(false);
  const [hatchAnimationProgress, setHatchAnimationProgress] = useState(0);
  const HATCH_ANIMATION_DURATION = 500; // 2 seconds for hatch animation
  
  // Poop dropping state
  const [poops, setPoops] = useState([]);
  const lastPoopTime = useRef(Date.now());
  const POOP_INTERVAL = 10000; // 10 seconds in milliseconds
  
  // Track last degradation time for real-time updates
  const lastDegradationTime = useRef(null);
  
  // Helper function to update pet data using the new updateUserData pattern
  const updatePet = (petId, changes) => {
    if (!userData) return;
    const updatedPets = userData.pets.map(pet => 
      pet.id === petId ? { ...pet, ...changes } : pet
    );
    updateUserData({ pets: updatedPets });
  };
  
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
    const incubation_ms = egg_incubation_minutes * MS_PER_MINUTE;
    
    if (ageMs > incubation_ms) {
      // Start hatch animation
      setIsHatching(true);
      setHatchAnimationProgress(0);
      
      // Hatch the egg by changing evolution_id[0] from 0 to 1
      const newEvolutionId = [1, petInfo.evolution_id[1]];
      updatePet(petInfo.id, { evolution_id: newEvolutionId });
      
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
        const hoursElapsed = timeSinceLastDegradation / MS_TO_HOURS;
        
        const hungerIncrease = HUNGER_DEGRADATION_PER_HOUR * hoursElapsed;
        const happinessDecrease = HAPPINESS_DEGRADATION_PER_HOUR * hoursElapsed;
        
        const newHunger = Math.min(1.0, petInfo.hunger + hungerIncrease);
        const newHappiness = Math.max(0.0, petInfo.happiness - happinessDecrease);
        
        console.log(`Pet ${petInfo.id}: Degradation update - ${hoursElapsed.toFixed(3)} hours elapsed - Hunger: ${petInfo.hunger.toFixed(3)} -> ${newHunger.toFixed(3)}, Happiness: ${petInfo.happiness.toFixed(3)} -> ${newHappiness.toFixed(3)}`);
        
        updatePet(petInfo.id, {
          hunger: newHunger,
          happiness: newHappiness,
          lastUpdate: currentTime
        });
        
        lastDegradationTime.current = currentTime;
      }
    } else {
      // Initialize lastUpdate if not set
      updatePet(petInfo.id, { lastUpdate: currentTime });
      lastDegradationTime.current = currentTime;
    }
  };

  // Handle poop dropping logic
  const handlePoopDropping = () => {
    const currentTime = Date.now();
    const timeSinceLastPoop = currentTime - lastPoopTime.current;
    
    if (timeSinceLastPoop > POOP_INTERVAL) {
      // Drop a poop at current position
      const currentPos = groupRef.current ? groupRef.current.position : { x: 0, y: 0 };
      const newPoop = {
        id: Date.now(), // Simple ID for now
        position: [currentPos.x, currentPos.y, 0.1], // Slightly above ground
        size: 's',
        createdAt: currentTime
      };
      
      setPoops(prevPoops => [...prevPoops, newPoop]);
      lastPoopTime.current = currentTime;
      
      console.log(`💩 Pet ${petInfo.id} dropped a poop at position [${currentPos.x.toFixed(2)}, ${currentPos.y.toFixed(2)}]`);
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
      const currentTime = Date.now();
      
      // If we haven't set a wait time yet, set one
      if (waitUntil === 0) {
        const waitTime = Math.random() * WAIT_TIME_RANGE;
        setWaitUntil(currentTime + waitTime);
        return; // Start waiting
      }
      
      // If we're still waiting, don't move
      if (currentTime < waitUntil) {
        return; // Still waiting
      }
      
      // Wait time is over, pick new direction and reset
      const baseAngle = Math.atan2(movementDirection.y, movementDirection.x);
      const angleOffset = (Math.random() - 0.5) * NEW_DIRECTION_SPREAD;
      const newAngle = baseAngle + angleOffset;
      const newDirection = new THREE.Vector2(Math.cos(newAngle), Math.sin(newAngle));
      
      setMovementDirection(newDirection);
      setMovementProgress(0); // Reset movement progress
      setWaitUntil(0); // Reset wait timer
    } else {
      // Move in current direction
      const velocity = movementDirection.clone().multiplyScalar(newSpeed * clampedDelta);
      const newPos = currentXY.add(velocity);
      
      // Clamp to bounds and handle bouncing
      if (newPos.x < bounds.x[0] || newPos.x > bounds.x[1]) {
        setMovementDirection(new THREE.Vector2(-movementDirection.x, movementDirection.y));
        newPos.x = THREE.MathUtils.clamp(newPos.x, bounds.x[0], bounds.x[1]);
      }
      if (newPos.y < bounds.y[0] || newPos.y > bounds.y[1]) {
        setMovementDirection(new THREE.Vector2(movementDirection.x, -movementDirection.y));
        newPos.y = THREE.MathUtils.clamp(newPos.y, bounds.y[0], bounds.y[1]);
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

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, DELTA_CLAMP);
    checkForHatching();
    handleDegradation();
    
    // Handle hatch animation
    if (isHatching) {
      const newProgress = hatchAnimationProgress + (delta * 1000); // Convert delta to ms
      setHatchAnimationProgress(newProgress);
      
      if (newProgress >= HATCH_ANIMATION_DURATION) {
        setIsHatching(false);
        setHatchAnimationProgress(0);
      }
    }
    
    if (petInfo.evolution_id[0] === 0) return; // Eggs don't move or poop
    
    handleMovement(clampedDelta);
    handlePoopDropping();
  });
  
  return (
    <>
      {/* Pet group that moves around */}
      <group ref={groupRef} onClick={handleClick}>
        <Billboard follow={true}>
          {/* Show hatch animation if hatching */}
          {isHatching ? (
            <EggHatchAnimation
              petInfo={petInfo}
              direction={direction}
              hatchAnimationProgress={hatchAnimationProgress}
              HATCH_ANIMATION_DURATION={HATCH_ANIMATION_DURATION}
            />
          ) : (
            /* Normal sprite display */
            <SpriteAnimator
              evolution_id={petInfo.evolution_id}
              direction={direction}
              flipInterval={0.5}
            />
          )}
        </Billboard>
      </group>
      
      {/* Render all poops - OUTSIDE the pet group so they stay put */}
      {poops.map((poop) => (
        <Poop
          key={poop.id}
          size={poop.size}
          position={poop.position}
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Clicked poop ${poop.id}`);
            // TODO: Add poop cleanup logic
          }}
        />
      ))}
    </>
  );
}

