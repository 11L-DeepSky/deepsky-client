
import React, { useState, useEffect, useRef } from 'react';

const LiveFeed = () => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let mounted = true;

    const fetchFrame = async () => {
      try {
        const response = await fetch('https://cd2af9606eaed8f7f92d2baab92cde2e.loophole.site/frame');
        const data = await response.json();
        
        if (!mounted) return;

        if (data && data.frame && imageRef.current) {
          const imageUrl = data.frame.startsWith('data:') 
            ? data.frame 
            : `data:image/jpeg;base64,${data.frame}`;
          imageRef.current.src = imageUrl;
        }
      } catch (error) {
        console.error('Error fetching live frame:', error);
      }
    };

    const intervalId = setInterval(fetchFrame, 200);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black/20 rounded-md overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          ref={imageRef}
          className="w-full h-full object-contain"
          alt="Live Feed"
        />
      </div>
    </div>
  );
};

export default LiveFeed;
