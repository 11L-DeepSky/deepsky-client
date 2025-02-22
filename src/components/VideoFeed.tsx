
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface VideoFeedProps {
  onNewFrame?: (imageDescription: string) => void;
}

const VideoFeed = ({ onNewFrame }: VideoFeedProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const images = [
    '/lovable-uploads/51dc6c30-bd99-4149-983b-e1ec50204f1e.png',
    '/lovable-uploads/61a5c3cb-d005-42c8-b6d8-f86fa8591ed0.png',
    '/lovable-uploads/6de64cd6-3c8e-41ac-b64b-c582af4de3d5.png',
    '/lovable-uploads/f9fe9a4e-e7f9-4bf9-ab84-7bd61e2b5453.png',
    '/lovable-uploads/d2609a86-937f-41d3-b7b1-466eee05ce88.png'
  ];

  useEffect(() => {
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

    // Send initial frame
    if (onNewFrame) {
      const imageDescription = `View from an aircraft showing a military aircraft in flight at high altitude. The image shows image number 1 in the sequence.`;
      onNewFrame(imageDescription);
    }

    return () => clearInterval(interval);
  }, [onNewFrame]);

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
