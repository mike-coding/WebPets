import React, { useState, useEffect } from 'react';
import { useNavigationContext, useUserDataContext } from '../hooks/AppContext';
import IconButton from './IconButton';

function EndlessRunnerUI() {
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
    <div 
      className="w-full h-full absolute top-0 left-0 pointer-events-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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
  );
}

export default EndlessRunnerUI;
