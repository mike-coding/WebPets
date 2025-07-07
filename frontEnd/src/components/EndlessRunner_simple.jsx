import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useNavigationContext, useUserDataContext } from '../hooks/AppContext';
import SpriteAnimator from '../sceneElements/SpriteAnimator';
import Tree from '../models/tree';
import IconButton from './IconButton';
import * as THREE from 'three';

// Game constants
const LANE_WIDTH = 1.2;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]; // Left, center, right lanes
const BASE_GAME_SPEED = 4;
const SPEED_INCREMENT = 0.0275; // Speed increase per coin collected
const COIN_SPAWN_RATE = 0.025;
const LARGE_COIN_SPAWN_RATE = 0.003;
const TREE_SPAWN_RATE = 0.03;

// Game objects
function Coin({ position, onCollect, positionRef, gameSpeed, gameState }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Move coin towards player using dynamic speed (stop if game is over or paused)
    if (!gameState.isGameOver && !gameState.isPaused) {
      meshRef.current.position.z += gameSpeed * delta;
    }
    
    // Update position ref for collision detection
    if (positionRef && positionRef.current) {
      positionRef.current.x = meshRef.current.position.x;
      positionRef.current.z = meshRef.current.position.z;
    }
    
    // Check if coin is past player (give buffer to move fully off-screen)
    if (meshRef.current.position.z > 5) {
      onCollect(); // Remove without collecting
    }
    
    // Simple rotation animation - rotate around Z axis since coin is now flat (stop if game is over or paused)
    if (!gameState.isGameOver && !gameState.isPaused) {
      meshRef.current.rotation.z += delta * 3;
    }
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

function LargeCoin({ position, onCollect, positionRef, gameSpeed, gameState }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Move coin towards player using dynamic speed (stop if game is over or paused)
    if (!gameState.isGameOver && !gameState.isPaused) {
      meshRef.current.position.z += gameSpeed * delta;
    }
    
    // Update position ref for collision detection
    if (positionRef && positionRef.current) {
      positionRef.current.x = meshRef.current.position.x;
      positionRef.current.z = meshRef.current.position.z;
    }
    
    // Check if coin is past player (give buffer to move fully off-screen)
    if (meshRef.current.position.z > 5) {
      onCollect(); // Remove without collecting
    }
    
    // Faster rotation animation for visual distinction (stop if game is over or paused)
    if (!gameState.isGameOver && !gameState.isPaused) {
      meshRef.current.rotation.z += delta * 5;
    }
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

function TreeObstacle({ position, onCollision, positionRef, gameSpeed, gameState }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Move tree towards player using dynamic speed (stop if game is over or paused)
    if (!gameState.isGameOver && !gameState.isPaused) {
      meshRef.current.position.z += gameSpeed * delta;
    }
    
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

function ScrollingGround({ gameSpeed, gameState }) {
  const meshRef = useRef();
  
  // Import grass tile modules (same as TiledGround.jsx)
  const tileModules = import.meta.glob('/src/sprites/tiles/grass/*.png', { eager: true });
  const tileUrlMap = Object.fromEntries(
    Object.entries(tileModules).map(([path, mod]) => {
      const fileName = path.split('/').pop();
      return [fileName, mod.default];
    })
  );
  
  // Same texture file names as TiledGround.jsx
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
  
  const textureUrls = textureFileNames.map(name => tileUrlMap[name]);
  const candidateTextures = useTexture(textureUrls);
  
  // Configure textures
  candidateTextures.forEach(tex => {
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
  });
  
  // Create scrolling atlas texture
  const atlasTexture = useMemo(() => {
    if (!candidateTextures || candidateTextures.length === 0) return null;
    
    const patternWidth = 10;
    const patternHeight = 40;
    const tileSize = 32;
    
    const canvas = document.createElement("canvas");
    canvas.width = patternWidth * tileSize;
    canvas.height = patternHeight * tileSize;
    const ctx = canvas.getContext("2d");

    // Create random atlas (same as TiledGround.jsx)
    for (let y = 0; y < patternHeight; y++) {
      for (let x = 0; x < patternWidth; x++) {
        const posX = x * tileSize;
        const posY = y * tileSize;
        const idx = Math.floor(Math.random() * candidateTextures.length);
        const img = candidateTextures[idx].image;
        ctx.drawImage(img, posX, posY, tileSize, tileSize);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    texture.repeat.set(1, 1);
    return texture;
  }, [candidateTextures]);
  
  useFrame((state, delta) => {
    if (!meshRef.current || !atlasTexture) return;
    
    // Scroll the texture at the same rate as coins and trees (stop if game is paused or over)
    if (!gameState.isGameOver && !gameState.isPaused) {
      atlasTexture.offset.y += (gameSpeed * delta) * 0.025; // Match the speed of moving objects
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, -0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 40]} />
      <meshStandardMaterial 
        map={atlasTexture || undefined}
        color="#ffffff"
        receiveShadow
      />
    </mesh>
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
    
    // Calculate spawn interval based on game speed to maintain consistent object density
    // As speed increases, spawn more frequently to maintain the same object spacing
    const baseSpawnInterval = 0.5;
    const speedMultiplier = currentGameSpeed / BASE_GAME_SPEED;
    const adjustedSpawnInterval = baseSpawnInterval / speedMultiplier;
    
    // Spawn coins and trees
    if (spawnTimerRef.current > adjustedSpawnInterval) {
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
      
      // Spawn large coin (rare) - only in lanes not used by regular coins and only after score 20
      if (gameState.score >= 20 && Math.random() < LARGE_COIN_SPAWN_RATE * 25) {
        const availableLanes = [0, 1, 2].filter(lane => !usedLanes.has(lane));
        if (availableLanes.length > 0) {
          const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
          usedLanes.add(lane); // Mark this lane as used
          const newLargeCoin = {
            id: Date.now() + Math.random() + 500,
            position: [LANES[lane], 0.5, -20]
          };
          setLargeCoins(prev => [...prev, newLargeCoin]);
        }
      }
      
      // Spawn tree - only in lanes not used by coins
      if (Math.random() < TREE_SPAWN_RATE * 25) {
        const availableLanes = [0, 1, 2].filter(lane => !usedLanes.has(lane));
        if (availableLanes.length > 0) {
          const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
          const newTree = {
            id: Date.now() + Math.random() + 1000,
            position: [LANES[lane], -0.5, -20] // Position trees on the ground surface
          };
          setTrees(prev => [...prev, newTree]);
        }
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
        if (distanceX < 0.35 && distanceZ < 0.6) {
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
        if (distanceX < 0.45 && distanceZ < 0.6) {
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
      <ambientLight intensity={1.5} />
      <directionalLight 
        position={[5, 10, 10]} 
        intensity={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Scrolling ground with grass tiles */}
      <ScrollingGround gameSpeed={currentGameSpeed} gameState={gameState} />
      
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
            gameState={gameState}
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
            gameState={gameState}
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
            gameState={gameState}
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
    isGameStarted: true,
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
  
  const collectCoinsAndExit = () => {
    // Navigate back to main/default, closing pet summary
    navigateTo("main", "default");
  };
  
  const togglePause = () => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  };
  
  if (!pet) {
    collectCoinsAndExit();
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
          <div onClick={togglePause}>
            <IconButton iconName={gameState.isPaused ? 'playIcon' : 'pauseIcon'} withEffects={false} />
          </div>
          <div className="text-white font-m6x11 text-xl bg-black/50 px-4 py-2 rounded">
            Score: {gameState.score}
          </div>
        </div>
        
        {/* Pause Screen */}
        {gameState.isPaused && !gameState.isGameOver && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center pointer-events-auto">
            <h1 className="text-white font-m6x11 text-3xl mb-4">Paused</h1>
            <button 
              onClick={togglePause}
              className="bg-blue-600 hover:bg-blue-500 text-white font-m6x11 px-6 py-3 rounded text-lg transition-colors mb-4"
            >
              Resume
            </button>
            <button 
              onClick={collectCoinsAndExit}
              className="bg-gray-600 hover:bg-gray-500 text-white font-m6x11 px-6 py-3 rounded text-lg transition-colors"
            >
              Exit Game
            </button>
          </div>
        )}
        
        {/* Game Over Screen */}
        {gameState.isGameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center pointer-events-auto">
            <h1 className="text-white font-m6x11 text-4xl mb-4">Game Over!</h1>
            <button 
              onClick={collectCoinsAndExit}
              className="bg-green-600 hover:bg-green-500 text-white font-m6x11 px-6 py-3 rounded text-lg transition-colors"
            >
              Collect {gameState.score} coins
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EndlessRunner;
