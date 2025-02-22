
import React, { useState, useEffect } from 'react';

const VideoFeed = () => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a random number to prevent caching
      const timestamp = new Date().getTime();
      setImageUrl(`/video-feed/latest.jpg?t=${timestamp}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
