import React, { useState, useRef, useEffect } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import { useNavigationContext, useUserDataContext } from '../hooks/AppContext';
import SpriteAnimator from '../sceneElements/SpriteAnimator';
import Tree from '../models/tree';
import IconButton from './IconButton';
import * as THREE from 'three';

// Game constants
const LANE_WIDTH = 1.2;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]; // Left, center, right lanes
const BASE_GAME_SPEED = 5;
const SPEED_INCREMENT = 0.05; // Speed increase per coin collected
const COIN_SPAWN_RATE = 0.025;
const LARGE_COIN_SPAWN_RATE = 0.006;
const TREE_SPAWN_RATE = 0.015;

// Game objects
function Coin({ position, onCollect, positionRef, gameSpeed }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Move coin towards player using dynamic speed
    meshRef.current.position.z += gameSpeed * delta;
    
    // Update position ref for collision detection
    if (positionRef && positionRef.current) {
      positionRef.current.x = meshRef.current.position.x;
      positionRef.current.z = meshRef.current.position.z;
    }
    
    // Check if coin is past player (give buffer to move fully off-screen)
    if (meshRef.current.position.z > 5) {
      onCollect(); // Remove without collecting
    }
    
    // Simple rotation animation - rotate around Z axis since coin is now flat
    meshRef.current.rotation.z += delta * 3;
  });
  
  return (
    <mesh ref={meshRef} position={position} scale={[0.25, 0.25, 0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.5, 0.5, 0.1, 8]} />
      <meshStandardMaterial 
        color="#FFD700" 
        metalness={1.0} 
        roughness={0.05} 
        emissive="#FFD700" 
        emissiveIntensity={0.8}
        toneMapped={false}
      />
    </mesh>
  );
}

function LargeCoin({ position, onCollect, positionRef, gameSpeed }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Move coin towards player using dynamic speed
    meshRef.current.position.z += gameSpeed * delta;
    
    // Update position ref for collision detection
    if (positionRef && positionRef.current) {
      positionRef.current.x = meshRef.current.position.x;
      positionRef.current.z = meshRef.current.position.z;
    }
    
    // Check if coin is past player (give buffer to move fully off-screen)
    if (meshRef.current.position.z > 5) {
      onCollect(); // Remove without collecting
    }
    
    // Faster rotation animation for visual distinction
    meshRef.current.rotation.z += delta * 5;
  });
  
  return (
    <mesh ref={meshRef} position={position} scale={[0.45, 0.45, 0.45]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.5, 0.5, 0.15, 8]} />
      <meshStandardMaterial 
        color="#FFD700" 
        metalness={1.0} 
        roughness={0.05} 
        emissive="#FFD700" 
        emissiveIntensity={0.8}
        toneMapped={false}
      />
    </mesh>
  );
}

function TreeObstacle({ position, onCollision, positionRef, gameSpeed }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Move tree towards player using dynamic speed
    meshRef.current.position.z += gameSpeed * delta;
    
    // Update position ref for collision detection
    if (positionRef && positionRef.current) {
      positionRef.current.x = meshRef.current.position.x;
      positionRef.current.z = meshRef.current.position.z;
    }
    
    // Check if tree is past player (give buffer to move fully off-screen)
    if (meshRef.current.position.z > 5) {
      onCollision(); // Remove without collision
    }
  });
  
  return (
    <group ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <Tree scale={[0.8, 0.8, 0.8]} castShadow receiveShadow />
    </group>
  );
}

function Player({ pet, lane, isGameOver, playerRef }) {
  const meshRef = useRef();
  const targetX = LANES[lane];
  const currentX = useRef(LANES[1]); // Start in middle lane
  
  // Expose the mesh ref to parent for collision detection
  useEffect(() => {
    if (playerRef) {
      playerRef.current = meshRef.current;
    }
  }, [playerRef]);
  
  useFrame((state, delta) => {
    if (!meshRef.current || isGameOver) return;
    
    // Smooth interpolation to target lane position
    const lerpSpeed = 30; // Adjust this for faster/slower transitions
    currentX.current = THREE.MathUtils.lerp(currentX.current, targetX, delta * lerpSpeed);
    meshRef.current.position.x = currentX.current;
    
    // Update the ref for collision detection
    if (playerRef) {
      playerRef.current = meshRef.current;
    }
  });
  
  if (isGameOver) {
    return null; // Hide player when game is over
  }
  
  return (
    <group ref={meshRef} position={[currentX.current, 0, 1]}>
      <SpriteAnimator 
        evolution_id={pet.evolution_id} 
        direction="U" // Always facing up
        flipInterval={0.25}
      />
    </group>
  );
}

function GameScene({ gameState, setGameState, pet }) {
  const [coins, setCoins] = useState([]);
  const [largeCoins, setLargeCoins] = useState([]);
  const [trees, setTrees] = useState([]);
  const spawnTimerRef = useRef(0);
  const coinPositionRefs = useRef({});
  const largeCoinPositionRefs = useRef({});
  const treePositionRefs = useRef({});
  const playerRef = useRef(); // Reference to the player for collision detection
  
  // Calculate current game speed based on score
  const currentGameSpeed = BASE_GAME_SPEED + (gameState.score * SPEED_INCREMENT);
  
  useFrame((state, delta) => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.isGameStarted) return;
    
    spawnTimerRef.current += delta;
    
    // Spawn coins and trees
    if (spawnTimerRef.current > 0.5) { // Spawn every 0.5 seconds
      spawnTimerRef.current = 0;
      
      let usedLanes = new Set(); // Track which lanes are used for coins this spawn cycle
      
      // Spawn coin
      if (Math.random() < COIN_SPAWN_RATE * 25) { // Adjust spawn rate
        const lane = Math.floor(Math.random() * 3);
        usedLanes.add(lane);
        const newCoin = {
          id: Date.now() + Math.random(),
          position: [LANES[lane], 0.5, -20]
        };
        setCoins(prev => [...prev, newCoin]);
      }
      
      // Spawn large coin (rare) - only in lanes not used by regular coins
      if (Math.random() < LARGE_COIN_SPAWN_RATE * 25) {
        const availableLanes = [0, 1, 2].filter(lane => !usedLanes.has(lane));
        if (availableLanes.length > 0) {
          const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
          const newLargeCoin = {
            id: Date.now() + Math.random() + 500,
            position: [LANES[lane], 0.5, -20]
          };
          setLargeCoins(prev => [...prev, newLargeCoin]);
        }
      }
      
      // Spawn tree
      if (Math.random() < TREE_SPAWN_RATE * 25) {
        const lane = Math.floor(Math.random() * 3);
        const newTree = {
          id: Date.now() + Math.random() + 1000,
          position: [LANES[lane], 0, -20] // Back to Y=0, the Tree component handles its own positioning
        };
        setTrees(prev => [...prev, newTree]);
      }
    }
    
    // Check collisions using actual player position
    const playerX = playerRef.current ? playerRef.current.position.x : LANES[gameState.currentLane];
    const playerZ = 1; // Player is now at z=1.5
    
    // Coin collection - check against actual mesh positions
    coins.forEach(coin => {
      const coinPos = coinPositionRefs.current[coin.id];
      if (coinPos && typeof coinPos.x === 'number' && typeof coinPos.z === 'number') {
        const distanceX = Math.abs(coinPos.x - playerX);
        const distanceZ = Math.abs(coinPos.z - playerZ);
        
        // More lenient collision detection for coins
        if (distanceX < 0.35 && distanceZ < 1.0) {
          console.log('Coin collected!', coin.id); // Debug log
          setGameState(prev => ({
            ...prev,
            score: prev.score + 1
          }));
          setCoins(prev => prev.filter(c => c.id !== coin.id));
          delete coinPositionRefs.current[coin.id]; // Clean up ref
        }
      }
    });
    
    // Large coin collection - check against actual mesh positions
    largeCoins.forEach(largeCoin => {
      const largeCoinPos = largeCoinPositionRefs.current[largeCoin.id];
      if (largeCoinPos && typeof largeCoinPos.x === 'number' && typeof largeCoinPos.z === 'number') {
        const distanceX = Math.abs(largeCoinPos.x - playerX);
        const distanceZ = Math.abs(largeCoinPos.z - playerZ);
        
        // More lenient collision detection for large coins
        if (distanceX < 0.45 && distanceZ < 1.0) {
          console.log('Large coin collected!', largeCoin.id); // Debug log
          setGameState(prev => ({
            ...prev,
            score: prev.score + 5
          }));
          setLargeCoins(prev => prev.filter(c => c.id !== largeCoin.id));
          delete largeCoinPositionRefs.current[largeCoin.id]; // Clean up ref
        }
      }
    });
    
    // Tree collision - check against actual mesh positions
    trees.forEach(tree => {
      const treePos = treePositionRefs.current[tree.id];
      if (treePos && typeof treePos.x === 'number' && typeof treePos.z === 'number') {
        const distanceX = Math.abs(treePos.x - playerX);
        const distanceZ = Math.abs(treePos.z - playerZ);
        
        // Stricter collision detection for trees - only if tree is at or ahead of player
        if (distanceX < 0.1 && (playerZ - treePos.z ) <= 0.6 && (playerZ - treePos.z ) >= 0.2) {
          console.log('Tree collision!', tree.id); // Debug log
          setGameState(prev => ({ ...prev, isGameOver: true }));
        }
      }
    });
  });
  
  const handleCoinCollect = (coinId) => {
    setCoins(prev => prev.filter(coin => coin.id !== coinId));
  };
  
  const handleLargeCoinCollect = (largeCoinId) => {
    setLargeCoins(prev => prev.filter(largeCoin => largeCoin.id !== largeCoinId));
  };
  
  const handleTreeCollision = (treeId) => {
    setTrees(prev => prev.filter(tree => tree.id !== treeId));
  };
  
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Ground plane */}
      <mesh position={[0, -0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 40]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>
      
      {/* Lane markers */}
      {LANES.map((laneX, index) => (
        <mesh key={index} position={[laneX, -0.45, -10]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 40]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}
      
      {/* Player */}
      <Player pet={pet} lane={gameState.currentLane} isGameOver={gameState.isGameOver} playerRef={playerRef} />
      
      {/* Coins */}
      {coins.map(coin => {
        // Create or get position ref for this coin
        if (!coinPositionRefs.current[coin.id]) {
          coinPositionRefs.current[coin.id] = { x: coin.position[0], z: coin.position[2] };
        }
        
        return (
          <Coin 
            key={coin.id} 
            position={coin.position} 
            onCollect={() => handleCoinCollect(coin.id)}
            positionRef={{ current: coinPositionRefs.current[coin.id] }}
            gameSpeed={currentGameSpeed}
          />
        );
      })}
      
      {/* Large Coins */}
      {largeCoins.map(largeCoin => {
        // Create or get position ref for this large coin
        if (!largeCoinPositionRefs.current[largeCoin.id]) {
          largeCoinPositionRefs.current[largeCoin.id] = { x: largeCoin.position[0], z: largeCoin.position[2] };
        }
        
        return (
          <LargeCoin 
            key={largeCoin.id} 
            position={largeCoin.position} 
            onCollect={() => handleLargeCoinCollect(largeCoin.id)}
            positionRef={{ current: largeCoinPositionRefs.current[largeCoin.id] }}
            gameSpeed={currentGameSpeed}
          />
        );
      })}
      
      {/* Trees */}
      {trees.map(tree => {
        // Create or get position ref for this tree
        if (!treePositionRefs.current[tree.id]) {
          treePositionRefs.current[tree.id] = { x: tree.position[0], z: tree.position[2] };
        }
        
        return (
          <TreeObstacle 
            key={tree.id} 
            position={tree.position} 
            onCollision={() => handleTreeCollision(tree.id)}
            positionRef={{ current: treePositionRefs.current[tree.id] }}
            gameSpeed={currentGameSpeed}
          />
        );
      })}
    </>
  );
}

function EndlessRunner() {
  const { navigation, navigateTo } = useNavigationContext();
  const { userData } = useUserDataContext();
  
  const pet = userData?.pets.find(p => p.id === navigation.activePetId);
  const [gameState, setGameState] = useState({
    isGameStarted: false,
    isGameOver: false,
    isPaused: false,
    currentLane: 1, // Start in middle lane
    score: 0
  });
  
  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState(null);
  
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e) => {
    if (!touchStart || gameState.isGameOver) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 10) { // Minimum swipe distance
      if (diff > 0) {
        // Swipe left
        setGameState(prev => ({
          ...prev,
          currentLane: Math.max(0, prev.currentLane - 1)
        }));
      } else {
        // Swipe right
        setGameState(prev => ({
          ...prev,
          currentLane: Math.min(2, prev.currentLane + 1)
        }));
      }
    }
    setTouchStart(null);
  };
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState.isGameOver) return;
      
      switch(e.key) {
        case 'ArrowLeft':
        case 'a':
          setGameState(prev => ({
            ...prev,
            currentLane: Math.max(0, prev.currentLane - 1)
          }));
          break;
        case 'ArrowRight':
        case 'd':
          setGameState(prev => ({
            ...prev,
            currentLane: Math.min(2, prev.currentLane + 1)
          }));
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isGameOver]);
  
  const startGame = () => {
    setGameState({
      isGameStarted: true,
      isGameOver: false,
      isPaused: false,
      currentLane: 1,
      score: 0
    });
  };
  
  const restartGame = () => {
    startGame();
  };
  
  const goBack = () => {
    navigateTo("petSummary", null, navigation.activePetId);
  };
  
  if (!pet) {
    goBack();
    return null;
  }
  
  return (
    <div className="w-full h-full relative">
      {/* Game Canvas */}
      <Canvas 
        camera={{ position: [0, 5, 3], fov: 60 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full"
      >
        {gameState.isGameStarted && (
          <GameScene gameState={gameState} setGameState={setGameState} pet={pet} />
        )}
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Top UI */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
          <div onClick={goBack}>
            <IconButton iconName='exitIcon' withEffects={false} />
          </div>
          <div className="text-white font-m6x11 text-xl bg-black/50 px-4 py-2 rounded">
            Score: {gameState.score}
          </div>
        </div>
        
        {/* Start Screen */}
        {!gameState.isGameStarted && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center pointer-events-auto">
            <h1 className="text-white font-m6x11 text-4xl mb-4">Endless Runner</h1>
            <p className="text-white font-m6x11 text-lg mb-8 text-center px-4">
              Swipe left/right or use arrow keys to change lanes<br/>
              Collect coins and avoid trees!
            </p>
            <button 
              onClick={startGame}
              className="bg-green-600 hover:bg-green-500 text-white font-m6x11 px-8 py-4 rounded text-xl transition-colors"
            >
              Start Game
            </button>
          </div>
        )}
        
        {/* Game Over Screen */}
        {gameState.isGameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center pointer-events-auto">
            <h1 className="text-white font-m6x11 text-4xl mb-4">Game Over!</h1>
            <p className="text-white font-m6x11 text-xl mb-8">Final Score: {gameState.score}</p>
            <div className="flex gap-4">
              <button 
                onClick={restartGame}
                className="bg-green-600 hover:bg-green-500 text-white font-m6x11 px-6 py-3 rounded text-lg transition-colors"
              >
                Play Again
              </button>
              <button 
                onClick={goBack}
                className="bg-gray-600 hover:bg-gray-500 text-white font-m6x11 px-6 py-3 rounded text-lg transition-colors"
              >
                Back to Pet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EndlessRunner;
