
import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { useToast } from "@/hooks/use-toast";

interface VideoFeedProps {
  onNewFrame?: (imageDescription: string, imageData: string) => void;
}

const VideoFeed = ({ onNewFrame }: VideoFeedProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<any>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastCaptureTime, setLastCaptureTime] = useState(0);
  const toast = useToast();
  const CAPTURE_INTERVAL = 5000; // Capture every 5 seconds

  const captureFrame = async () => {
    if (!canvasRef.current || !playerRef.current) return;

    // Check if enough time has passed since last capture
    const currentTime = Date.now();
    if (currentTime - lastCaptureTime < CAPTURE_INTERVAL) return;
    setLastCaptureTime(currentTime);

    const canvas = canvasRef.current;
    
    // Set canvas size to match video dimensions
    canvas.width = 640;
    canvas.height = 360;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    try {
      const videoId = playerRef.current.target.getVideoData().video_id;
      console.log(`Capturing frame at ${new Date().toISOString()}`);
      
      // Get high-quality thumbnail for analysis
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hq720.jpg`;
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      // Convert the image loading to a Promise
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = thumbnailUrl;
      });

      // Draw the image and get base64 data
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);
      
      // Send frame for analysis and wait for response
      if (onNewFrame) {
        await onNewFrame(
          'Analyzing current frame for potential aircraft or obstacles.',
          base64Image
        );
        console.log('Frame successfully analyzed');
      }
    } catch (error) {
      console.error('Error during frame capture:', error);
      toast.toast({
        title: "Frame Capture Error",
        description: "Failed to capture video frame. Retrying...",
        variant: "destructive"
      });
    }
  };

  const handlePlayerReady = (event: any) => {
    console.log('YouTube player ready');
    playerRef.current = event;
    setIsCapturing(true);
    
    // Start capture immediately
    captureFrame();
  };

  useEffect(() => {
    if (isCapturing) {
      console.log('Starting continuous capture loop');
      
      // Create a continuous capture loop
      const captureLoop = async () => {
        await captureFrame();
        // Schedule next capture immediately
        if (isCapturing) {
          requestAnimationFrame(captureLoop);
        }
      };

      // Start the capture loop
      captureLoop();

      // Cleanup function
      return () => {
        setIsCapturing(false);
      };
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
              playlist: 'zMhzoNhSZTA',
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
