
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface VideoFeedProps {
  onNewFrame?: (imageDescription: string) => void;
}

const VideoFeed = ({ onNewFrame }: VideoFeedProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const images = [
    '/lovable-uploads/ca63b729-1c25-4336-8add-fd87242f2135.png',
    '/lovable-uploads/77cc8515-d8e1-4863-8abb-14cc1a0df0f0.png',
    '/lovable-uploads/9f47fd5d-8251-4e7b-b022-bf6a54fb92cc.png',
    '/lovable-uploads/74510882-619c-4748-bd05-78ea8c094f2b.png',
    '/lovable-uploads/4178e792-b2cc-498c-ac35-f55e2a44585a.png'
  ];

  useEffect(() => {
    // Send initial frame
    if (onNewFrame) {
      const imageDescription = `View from the cockpit of a small aircraft. Analyzing forward view for any potential aircraft or obstacles.`;
      onNewFrame(imageDescription);
    }

    // Set up the image rotation interval
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const nextIndex = (prev + 1) % images.length;
        // When image changes, send the new frame for analysis
        if (onNewFrame) {
          const imageDescription = `View from the cockpit of a small aircraft. Analyzing forward view for any potential aircraft or obstacles. Frame ${nextIndex + 1} of sequence.`;
          onNewFrame(imageDescription);
        }
        return nextIndex;
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []); // Only run on mount

  return (
    <div className="relative w-full h-full bg-black/20 rounded-md overflow-hidden">
      <img
        src={images[currentImageIndex]}
        alt="Live Feed"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default VideoFeed;
