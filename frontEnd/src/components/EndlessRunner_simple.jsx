import React, { useState, useRef, useEffect } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import { useNavigationContext, useUserDataContext } from '../hooks/AppContext';
import SpriteAnimator from '../sceneElements/SpriteAnimator';
import Tree from '../models/tree';
import IconButton from './IconButton';

// Game constants
const LANE_WIDTH = 2;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]; // Left, center, right lanes
const GAME_SPEED = 5;
const COIN_SPAWN_RATE = 0.02;
const TREE_SPAWN_RATE = 0.015;

// Game objects
function Coin({ position, onCollect, positionRef }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Move coin towards player
    meshRef.current.position.z += GAME_SPEED * delta;
    
    // Update position ref for collision detection
    if (positionRef && positionRef.current) {
      positionRef.current.x = meshRef.current.position.x;
      positionRef.current.z = meshRef.current.position.z;
    }
    
    // Check if coin is past player
    if (meshRef.current.position.z > 2) {
      onCollect(); // Remove without collecting
    }
    
    // Simple rotation animation
    meshRef.current.rotation.y += delta * 3;
  });
  
  return (
    <mesh ref={meshRef} position={position} scale={[0.3, 0.3, 0.3]}>
      <cylinderGeometry args={[0.5, 0.5, 0.1, 8]} />
      <meshBasicMaterial color="#FFD700" />
    </mesh>
  );
}

function TreeObstacle({ position, onCollision, positionRef }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Move tree towards player
    meshRef.current.position.z += GAME_SPEED * delta;
    
    // Update position ref for collision detection
    if (positionRef && positionRef.current) {
      positionRef.current.x = meshRef.current.position.x;
      positionRef.current.z = meshRef.current.position.z;
    }
    
    // Check if tree is past player
    if (meshRef.current.position.z > 2) {
      onCollision(); // Remove without collision
    }
  });
  
  return (
    <group ref={meshRef} position={position}>
      <Tree scale={[0.8, 0.8, 0.8]} />
    </group>
  );
}

function Player({ pet, lane, isGameOver }) {
  const playerPosition = [LANES[lane], 0, 0];
  
  if (isGameOver) {
    return null; // Hide player when game is over
  }
  
  return (
    <group position={playerPosition}>
      <SpriteAnimator 
        evolution_id={pet.evolution_id} 
        direction="U" // Always facing up
        flipInterval={0.3}
      />
    </group>
  );
}

function GameScene({ gameState, setGameState, pet }) {
  const [coins, setCoins] = useState([]);
  const [trees, setTrees] = useState([]);
  const spawnTimerRef = useRef(0);
  const coinPositionRefs = useRef({});
  const treePositionRefs = useRef({});
  
  useFrame((state, delta) => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.isGameStarted) return;
    
    spawnTimerRef.current += delta;
    
    // Spawn coins and trees
    if (spawnTimerRef.current > 0.5) { // Spawn every 0.5 seconds
      spawnTimerRef.current = 0;
      
      // Spawn coin
      if (Math.random() < COIN_SPAWN_RATE * 25) { // Adjust spawn rate
        const lane = Math.floor(Math.random() * 3);
        const newCoin = {
          id: Date.now() + Math.random(),
          position: [LANES[lane], 0.5, -20]
        };
        setCoins(prev => [...prev, newCoin]);
      }
      
      // Spawn tree
      if (Math.random() < TREE_SPAWN_RATE * 25) {
        const lane = Math.floor(Math.random() * 3);
        const newTree = {
          id: Date.now() + Math.random() + 1000,
          position: [LANES[lane], 0, -20]
        };
        setTrees(prev => [...prev, newTree]);
      }
    }
    
    // Check collisions
    const playerX = LANES[gameState.currentLane];
    const playerZ = 0; // Player is at z=0
    
    // Coin collection - check against actual mesh positions
    coins.forEach(coin => {
      const coinPos = coinPositionRefs.current[coin.id];
      if (coinPos && typeof coinPos.x === 'number' && typeof coinPos.z === 'number') {
        const distanceX = Math.abs(coinPos.x - playerX);
        const distanceZ = Math.abs(coinPos.z - playerZ);
        
        // More lenient collision detection for coins
        if (distanceX < 0.5 && distanceZ < 1.0) {
          console.log('Coin collected!', coin.id); // Debug log
          setGameState(prev => ({
            ...prev,
            score: prev.score + 10,
            coinsCollected: prev.coinsCollected + 1
          }));
          setCoins(prev => prev.filter(c => c.id !== coin.id));
          delete coinPositionRefs.current[coin.id]; // Clean up ref
        }
      }
    });
    
    // Tree collision - check against actual mesh positions
    trees.forEach(tree => {
      const treePos = treePositionRefs.current[tree.id];
      if (treePos && typeof treePos.x === 'number' && typeof treePos.z === 'number') {
        const distanceX = Math.abs(treePos.x - playerX);
        const distanceZ = Math.abs(treePos.z - playerZ);
        
        // Stricter collision detection for trees
        if (distanceX < 0.6 && distanceZ < 0.8) {
          console.log('Tree collision!', tree.id); // Debug log
          setGameState(prev => ({ ...prev, isGameOver: true }));
        }
      }
    });
  });
  
  const handleCoinCollect = (coinId) => {
    setCoins(prev => prev.filter(coin => coin.id !== coinId));
  };
  
  const handleTreeCollision = (treeId) => {
    setTrees(prev => prev.filter(tree => tree.id !== treeId));
  };
  
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 10, 5]} intensity={0.5} />
      
      {/* Ground plane */}
      <mesh position={[0, -0.5, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 40]} />
        <meshBasicMaterial color="#90EE90" />
      </mesh>
      
      {/* Lane markers */}
      {LANES.map((laneX, index) => (
        <mesh key={index} position={[laneX, -0.45, -10]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 40]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      ))}
      
      {/* Player */}
      <Player pet={pet} lane={gameState.currentLane} isGameOver={gameState.isGameOver} />
      
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
    score: 0,
    coinsCollected: 0
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
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
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
      score: 0,
      coinsCollected: 0
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
          <div className="text-white font-m6x11 text-xl bg-black/50 px-4 py-2 rounded">
            Coins: {gameState.coinsCollected}
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
            <p className="text-white font-m6x11 text-xl mb-2">Final Score: {gameState.score}</p>
            <p className="text-white font-m6x11 text-lg mb-8">Coins Collected: {gameState.coinsCollected}</p>
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
        
        {/* Controls hint */}
        {gameState.isGameStarted && !gameState.isGameOver && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white font-m6x11 text-sm bg-black/50 px-4 py-2 rounded">
            Swipe or use ← → keys to move
          </div>
        )}
      </div>
    </div>
  );
}

export default EndlessRunner;
