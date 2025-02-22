
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
      {/* Radar background with rotating line effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_#001100_20%,_#001100_40%,_transparent_40%,_transparent_60%,_#001100_60%,_#001100_80%,_transparent_80%)]">
        <div className="absolute inset-0 animate-radar-spin origin-center">
          <div className="h-1/2 w-1 bg-gradient-to-t from-green-500/80 to-transparent mx-auto" />
        </div>
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
    </div>
  );
};

export default RadarView;
