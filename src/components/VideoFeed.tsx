
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface VideoFeedProps {
  onNewFrame?: (imageDescription: string) => void;
}

const VideoFeed = ({ onNewFrame }: VideoFeedProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const images = [
    'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7'
  ];

  useEffect(() => {
    // Send initial frame
    if (onNewFrame) {
      const imageDescription = `View from an aircraft showing a military aircraft in flight at high altitude. The image shows image number 1 in the sequence.`;
      onNewFrame(imageDescription);
    }

    // Set up the image rotation interval
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const nextIndex = (prev + 1) % images.length;
        // When image changes, send the new frame for analysis
        if (onNewFrame) {
          const imageDescription = `View from an aircraft showing a military aircraft in flight at high altitude. The image shows image number ${nextIndex + 1} in the sequence.`;
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
