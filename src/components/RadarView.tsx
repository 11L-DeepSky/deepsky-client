
import React, { useEffect, useState } from 'react';

interface RadarDot {
  x: number;
  y: number;
  size: number;
  type: 'BIRD' | 'SMALL_PLANE' | 'BIG_PLANE';
}

interface RadarViewProps {
  dots?: RadarDot[];
}

const typeColors = {
  BIRD: '#FFD700',
  SMALL_PLANE: '#00FF00',
  BIG_PLANE: '#FF0000'
};

const RadarView = ({ dots = [] }: RadarViewProps) => {
  return (
    <div className="relative w-full h-full bg-black/80 rounded-md overflow-hidden">
      {/* Semicircle background with distance rings */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
          {/* Distance rings */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="#001100" strokeWidth="0.5"/>
          <circle cx="50" cy="50" r="30" fill="none" stroke="#001100" strokeWidth="0.5"/>
          <circle cx="50" cy="50" r="20" fill="none" stroke="#001100" strokeWidth="0.5"/>
          <circle cx="50" cy="50" r="10" fill="none" stroke="#001100" strokeWidth="0.5"/>
          
          {/* Mask to show only top half */}
          <rect x="0" y="50" width="100" height="50" fill="black"/>
        </svg>
      </div>

      {/* Scanning line */}
      <div className="absolute inset-x-0 bottom-0 origin-bottom">
        <div 
          className="h-full w-[2px] mx-auto bg-gradient-to-t from-green-500/80 to-transparent"
          style={{
            animation: 'radar-scan 4s linear infinite',
            transformOrigin: 'bottom center',
          }}
        />
      </div>

      {/* Render radar dots */}
      {dots.map((dot, index) => (
        <div
          key={index}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            backgroundColor: typeColors[dot.type],
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="absolute -inset-1 bg-current opacity-20 rounded-full animate-ping" />
        </div>
      ))}

      {/* Add grid overlay */}
      <div className="absolute inset-0 border-t border-green-900/30" style={{ top: '25%' }} />
      <div className="absolute inset-0 border-t border-green-900/30" style={{ top: '50%' }} />
      <div className="absolute inset-0 border-l border-green-900/30" style={{ left: '25%' }} />
      <div className="absolute inset-0 border-l border-green-900/30" style={{ left: '50%' }} />
      <div className="absolute inset-0 border-l border-green-900/30" style={{ left: '75%' }} />
    </div>
  );
};

export default RadarView;
