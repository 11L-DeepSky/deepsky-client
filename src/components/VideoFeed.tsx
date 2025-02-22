import React, { useState, useEffect } from 'react';

interface VideoFeedProps {
  onNewFrame?: (imageDescription: string, imageBase64: string) => void;
}

const VideoFeed = ({ onNewFrame }: VideoFeedProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [imageBase64Cache, setImageBase64Cache] = useState<string[]>([]);

  // Updated image URLs from ibb.co
  const images = [
    'https://i.ibb.co/8gyFbKYd/hq720.png',
    'https://i.ibb.co/gZRYmpw8/800x450-q95.png',
    'https://i.ibb.co/XZ14k561/129936813-p0frbscf.png',
    'https://i.ibb.co/hF0DxFGP/110302-F-TY646-073.png',
    'https://i.ibb.co/zVKt8zC1/GSD3b7-PW4-AAQjm-D.png'
  ];

  // Function to convert image URL to base64
  const getImageAsBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Keep the data:image format as required by OpenAI
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return '';
    }
  };

  useEffect(() => {
    // Preload and cache all images as base64
    const loadImages = async () => {
      const base64Images = await Promise.all(
        images.map(url => getImageAsBase64(url))
      );
      setImageBase64Cache(base64Images);

      // Send initial frame description
      if (onNewFrame && base64Images[0]) {
        const imageDescription = `View from the cockpit of a small aircraft. Analyzing forward view for any potential aircraft or obstacles.`;
        onNewFrame(imageDescription, base64Images[0]);
      }
    };

    loadImages();

    // Set up the image rotation interval
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const nextIndex = (prev + 1) % images.length;
        if (onNewFrame && imageBase64Cache[nextIndex]) {
          const imageDescription = `View from the cockpit of a small aircraft. Analyzing forward view for any potential aircraft or obstacles. Frame ${nextIndex + 1} of sequence.`;
          onNewFrame(imageDescription, imageBase64Cache[nextIndex]);
        }
        return nextIndex;
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [imageBase64Cache.length]); // Depend on cache length to ensure we have the images

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
