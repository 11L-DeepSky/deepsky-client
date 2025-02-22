
import React from 'react';

const RadarView = () => {
  return (
    <div className="relative w-full h-full bg-black/20 rounded-md overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border-2 border-green-500/20 animate-pulse">
          <div className="w-32 h-32 rounded-full border-2 border-green-500/40 m-auto mt-8">
            <div className="w-16 h-16 rounded-full border-2 border-green-500/60 m-auto mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarView;
