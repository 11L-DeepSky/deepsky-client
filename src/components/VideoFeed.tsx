
import React, { useState, useEffect } from 'react';

const VideoFeed = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => prev + 1);
      setImageUrl(`https://via.assets.so/img.jpg?w=400&h=150&tc=blue&bg=#cecece&t=${counter}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [counter]);

  return (
    <div className="relative w-full h-full bg-black/20 rounded-md overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Live Feed"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Waiting for video feed...</p>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
