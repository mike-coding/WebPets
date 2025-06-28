import React, { useState, useRef } from 'react';
import EggCard from './EggCard';

function EggCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at index 1 (first real egg)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const containerRef = useRef(null);
  
  const eggs = [
    { id: 0, hoverTip: "Mineral Egg" },
    { id: 1, hoverTip: "Seed Egg" },
    { id: 2, hoverTip: "Beast Egg" }
  ];

  // Create infinite loop: [last, first, second, third, first]
  const infiniteEggs = [
    eggs[eggs.length - 1], // Last egg at the beginning
    ...eggs,               // All eggs in order
    eggs[0]                // First egg at the end
  ];

  const nextEgg = () => {
    if (!isTransitioning) return;
    
    setCurrentIndex(prev => prev + 1);
    
    // If we're at the duplicate first egg, jump back to real first egg
    setTimeout(() => {
      if (currentIndex + 1 === infiniteEggs.length - 1) {
        setIsTransitioning(false);
        setCurrentIndex(1);
        setTimeout(() => setIsTransitioning(true), 50);
      }
    }, 300);
  };

  const prevEgg = () => {
    if (!isTransitioning) return;
    
    setCurrentIndex(prev => prev - 1);
    
    // If we're at the duplicate last egg, jump to real last egg
    setTimeout(() => {
      if (currentIndex - 1 === 0) {
        setIsTransitioning(false);
        setCurrentIndex(eggs.length);
        setTimeout(() => setIsTransitioning(true), 50);
      }
    }, 300);
  };

  // Get the actual egg index for display purposes (0, 1, or 2)
  const getActualIndex = () => {
    if (currentIndex === 0) return eggs.length - 1; // Last egg
    if (currentIndex === infiniteEggs.length - 1) return 0; // First egg
    return currentIndex - 1; // Normal eggs
  };

  // Touch event handlers
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextEgg();
    } else if (isRightSwipe) {
      prevEgg();
    }
  };  return (
    <div className="flex flex-col items-center gap-4 w-full m-8">
      {/* Carousel Container */}      <div 
        ref={containerRef}
        className="relative w-[240px] h-[200px] overflow-hidden touch-pan-y pointer-events-auto"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className={`flex ${isTransitioning ? 'transition-transform duration-300 ease-in-out' : ''}`}
          style={{ transform: `translateX(-${currentIndex * 240}px)` }}
        >
          {infiniteEggs.map((egg, index) => (
            <div key={`${egg.id}-${index}`} className="min-w-[240px] flex justify-center">
              <EggCard egg_id={egg.id} hoverTip={egg.hoverTip} />
            </div>
          ))}
        </div>
      </div>      
      {/* Egg Name/Type Display */}
      <div className="font-m6x11 text-xl text-white text-center">
        {eggs[getActualIndex()].hoverTip}
      </div>

      {/* Indicator Dots */}
      <div className="flex gap-2">
        {eggs.map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition-colors duration-200 ${
              index === getActualIndex() ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default EggCarousel;
