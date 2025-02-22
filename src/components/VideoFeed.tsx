
import React, { useState, useEffect } from 'react';

interface VideoFeedProps {
  onNewFrame?: (imageDescription: string) => void;
}

const VideoFeed = ({ onNewFrame }: VideoFeedProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Updated image paths with the new uploads
  const images = [
    '/lovable-uploads/1a71c9c0-6e9e-4052-a65f-3e2c80669fe3.png',
    '/lovable-uploads/f399dd6a-801b-43b4-8fd1-566849f7baca.png',
    '/lovable-uploads/974d7639-934d-448d-8854-babe9f8e0468.png',
    '/lovable-uploads/50d82fb5-ad0e-496f-bc3d-33cad599f167.png',
    '/lovable-uploads/ace6539d-0fad-4aaf-9345-c2e50585479a.png'
  ];

  useEffect(() => {
    // Preload images to ensure they're in browser cache
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Send initial frame description
    if (onNewFrame) {
      const imageDescription = `View from the cockpit of a small aircraft. Analyzing forward view for any potential aircraft or obstacles.`;
      onNewFrame(imageDescription);
    }

    // Set up the image rotation interval
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const nextIndex = (prev + 1) % images.length;
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
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          key={images[currentImageIndex]} // Add key to force re-render on image change
          src={images[currentImageIndex]}
          alt={`Aircraft view frame ${currentImageIndex + 1}`}
          className="w-full h-full object-contain"
          onError={(e) => {
            console.error('Image failed to load:', images[currentImageIndex]);
            const target = e.target as HTMLImageElement;
            target.style.opacity = '0';
          }}
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.opacity = '1';
          }}
          style={{
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      </div>
    </div>
  );
};

export default VideoFeed;
