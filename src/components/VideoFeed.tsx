
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
  const lastCaptureTime = useRef<number>(0);
  const isProcessing = useRef<boolean>(false);
  const { toast } = useToast();
  const MIN_INTERVAL = 3000; // Minimum 3 seconds between captures

  const captureFrame = async () => {
    // Check if we're already processing a frame or if minimum interval hasn't passed
    const now = Date.now();
    if (isProcessing.current || now - lastCaptureTime.current < MIN_INTERVAL) {
      return;
    }

    if (!canvasRef.current || !playerRef.current) return;

    isProcessing.current = true;
    const canvas = canvasRef.current;
    
    // Set canvas size to match video dimensions
    canvas.width = 640; // Standard YouTube video width
    canvas.height = 360; // Standard YouTube video height
    
    // Draw the current frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    try {
      // Get the video ID for logging
      const videoId = playerRef.current.target.getVideoData().video_id;
      console.log('Capturing frame at:', new Date().toISOString());
      
      // Instead of trying to capture the actual frame, use a thumbnail
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hq720.jpg`;
      
      // Create an image element to load the thumbnail
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = thumbnailUrl;
      });

      // Draw the image to canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);

      // Send frame for analysis and wait for response
      if (onNewFrame) {
        try {
          await onNewFrame(
            'Analyzing current frame for potential aircraft or obstacles.',
            base64Image
          );
          console.log('Frame successfully analyzed');
          lastCaptureTime.current = Date.now();
        } catch (error) {
          console.error('Error from Supabase analysis:', error);
          // Don't throw here - we want to continue the loop even if analysis fails
        }
      }
    } catch (error) {
      console.error('Error capturing frame:', error);
      toast({
        variant: "destructive",
        title: "Warning",
        description: "Frame capture error - continuing monitoring",
      });
    } finally {
      isProcessing.current = false; // Always reset processing flag
    }
  };

  const handlePlayerReady = (event: any) => {
    console.log('YouTube player ready');
    playerRef.current = event;
    setIsCapturing(true);
  };

  useEffect(() => {
    if (!isCapturing) return;

    console.log('Starting capture loop');
    
    // Create the capture loop
    const intervalId = setInterval(async () => {
      await captureFrame();
    }, MIN_INTERVAL);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      setIsCapturing(false);
    };
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
