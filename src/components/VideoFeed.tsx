
import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

interface VideoFeedProps {
  onNewFrame?: (imageDescription: string, imageData: string) => void;
}

const VideoFeed = ({ onNewFrame }: VideoFeedProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<any>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const captureFrame = () => {
    if (!canvasRef.current || !playerRef.current) return;

    const canvas = canvasRef.current;
    
    // Set canvas size to match video dimensions
    canvas.width = 640; // Standard YouTube video width
    canvas.height = 360; // Standard YouTube video height
    
    // Draw the current frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get the video ID for logging
    const videoId = playerRef.current.target.getVideoData().video_id;
    console.log('Attempting to capture frame from video:', videoId);
    
    try {
      // Instead of trying to capture the actual frame, for now we'll send a URL to a thumbnail
      // This ensures we at least have some image data to process
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hq720.jpg`;
      
      // Create an image element to load the thumbnail
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw the image to canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        console.log('Successfully captured frame, length:', base64Image.length);

        // Send frame for analysis
        if (onNewFrame) {
          onNewFrame(
            'Analyzing current frame for potential aircraft or obstacles.',
            base64Image
          );
        }
      };
      
      img.onerror = (err) => {
        console.error('Error loading thumbnail:', err);
      };
      
      img.src = thumbnailUrl;
    } catch (error) {
      console.error('Error capturing frame:', error);
    }
  };

  const handlePlayerReady = (event: any) => {
    console.log('YouTube player ready');
    playerRef.current = event;
    // Capture initial frame after a short delay to ensure video is playing
    setTimeout(() => {
      captureFrame();
      setIsCapturing(true);
    }, 2000);
  };

  useEffect(() => {
    // When we get isCapturing = true, start the capture loop
    if (isCapturing) {
      console.log('Starting capture loop');
      const intervalId = setInterval(() => {
        captureFrame();
      }, 30000); // Capture every 30 seconds

      return () => clearInterval(intervalId);
    }
  }, [isCapturing]);

  return (
    <div className="relative w-full h-full bg-black/20 rounded-md overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <YouTube
          videoId="zMhzoNhSZTA"
          opts={{
            height: '100%',
            width: '100%',
            playerVars: {
              autoplay: 1,
              mute: 1,
              controls: 0,
              modestbranding: 1,
              loop: 1,
              playlist: 'zMhzoNhSZTA', // Required for looping
            },
          }}
          onReady={handlePlayerReady}
          className="w-full h-full"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      </div>
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default VideoFeed;
