
import React, { useState, useEffect } from 'react';

interface VideoFeedProps {
  onNewFrame?: (imageDescription: string, imageUrl: string) => void;
}

const VideoFeed = ({ onNewFrame }: VideoFeedProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Updated image URLs from ibb.co
  const images = [
    'https://i.ibb.co/8gyFbKYd/hq720.png',
    'https://i.ibb.co/gZRYmpw8/800x450-q95.png',
    'https://i.ibb.co/XZ14k561/129936813-p0frbscf.png',
    'https://i.ibb.co/hF0DxFGP/110302-F-TY646-073.png',
    'https://i.ibb.co/zVKt8zC1/GSD3b7-PW4-AAQjm-D.png'
  ];

  useEffect(() => {
    // Send initial frame
    if (onNewFrame && images[0]) {
      const imageDescription = `View from the cockpit of a small aircraft. Analyzing forward view for any potential aircraft or obstacles.`;
      onNewFrame(imageDescription, images[0]);
    }

    // Set up the image rotation interval
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const nextIndex = (prev + 1) % images.length;
        if (onNewFrame && images[nextIndex]) {
          const imageDescription = `View from the cockpit of a small aircraft. Analyzing forward view for any potential aircraft or obstacles. Frame ${nextIndex + 1} of sequence.`;
          onNewFrame(imageDescription, images[nextIndex]);
        }
        return nextIndex;
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []); // No dependencies needed since we're using the static images array

  return (
    <div className="relative w-full h-full bg-black/20 rounded-md overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          key={images[currentImageIndex]}
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
