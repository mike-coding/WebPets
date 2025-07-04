import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useNavigationContext, useUserDataContext } from '../hooks/AppContext';
import SpriteAnimator from '../sceneElements/SpriteAnimator';

// Game constants
const LANE_WIDTH = 2;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]; // Left, center, right lanes
const GAME_SPEED = 5;
const COIN_SPAWN_RATE = 0.02;
const TREE_SPAWN_RATE = 0.015;

// Game objects
function Coin({ position, onCollect }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Move coin towards player
    meshRef.current.position.z += GAME_SPEED * delta;
    
    // Check if coin is past player
    if (meshRef.current.position.z > 2) {
      onCollect(null); // Remove without collecting
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

function Tree({ position, onCollision }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Move tree towards player
    meshRef.current.position.z += GAME_SPEED * delta;
    
    // Check if tree is past player
    if (meshRef.current.position.z > 2) {
      onCollision(null); // Remove without collision
    }
  });
  
  return (
    <mesh ref={meshRef} position={position} scale={[0.5, 1, 0.5]}>
      <cylinderGeometry args={[0.3, 0.5, 2, 8]} />
      <meshBasicMaterial color="#8B4513" />
    </mesh>
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

function EndlessRunnerScene() {
  const { navigation } = useNavigationContext();
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
  
  const [coins, setCoins] = useState([]);
  const [trees, setTrees] = useState([]);
  const spawnTimerRef = useRef(0);
  
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
    
    // Coin collection
    coins.forEach(coin => {
      const distance = Math.sqrt(
        Math.pow(coin.position[0] - playerX, 2) + 
        Math.pow(coin.position[2], 2)
      );
      if (distance < 0.8) {
        setGameState(prev => ({
          ...prev,
          score: prev.score + 10,
          coinsCollected: prev.coinsCollected + 1
        }));
        setCoins(prev => prev.filter(c => c.id !== coin.id));
      }
    });
    
    // Tree collision
    trees.forEach(tree => {
      const distance = Math.sqrt(
        Math.pow(tree.position[0] - playerX, 2) + 
        Math.pow(tree.position[2], 2)
      );
      if (distance < 0.8) {
        setGameState(prev => ({ ...prev, isGameOver: true }));
      }
    });
  });
  
  const handleCoinCollect = (coinId) => {
    setCoins(prev => prev.filter(coin => coin.id !== coinId));
  };
  
  const handleTreeCollision = (treeId) => {
    setTrees(prev => prev.filter(tree => tree.id !== treeId));
  };
  
  if (!pet) {
    return null;
  }
  
  return (
    <>
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
      {coins.map(coin => (
        <Coin 
          key={coin.id} 
          position={coin.position} 
          onCollect={() => handleCoinCollect(coin.id)} 
        />
      ))}
      
      {/* Trees */}
      {trees.map(tree => (
        <Tree 
          key={tree.id} 
          position={tree.position} 
          onCollision={() => handleTreeCollision(tree.id)} 
        />
      ))}
    </>
  );
}

export default EndlessRunnerScene;
