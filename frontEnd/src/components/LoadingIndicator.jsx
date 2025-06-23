import React from 'react';

const LoadingIndicator = () => {
  const circleStyle = {
    width: '1rem',
    height: '1rem',
    backgroundColor: 'white',
    borderRadius: '50%',
    margin: '0 0.25rem',
    animation: 'sineWave 1.25s ease-in-out infinite'
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ ...circleStyle, animationDelay: '0s' }} />
      <div style={{ ...circleStyle, animationDelay: '0.2s' }} />
      <div style={{ ...circleStyle, animationDelay: '0.4s' }} />

      {/* CSS keyframes for the sine wave animation */}
      <style>
        {`
          @keyframes sineWave {
            0% { transform: translateY(0); }
            25% { transform: translateY(-10px); }
            50% { transform: translateY(0); }
            75% { transform: translateY(0px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingIndicator;


