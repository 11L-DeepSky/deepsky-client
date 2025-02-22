
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface VideoFeedProps {
  onNewFrame?: (imageDescription: string, imageData: string) => void;
}

const VideoFeed = ({ onNewFrame }: VideoFeedProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
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

    isProcessing.current = true;
    
    try {
      // Fetch the image from the endpoint
      const response = await fetch('https://via.assets.so/img.jpg?w=400&h=150&tc=blue&bg=#cecece&t=TEST IMAGE');
      const blob = await response.blob();
      
      // Convert blob to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      // Update the displayed image
      if (imageRef.current) {
        imageRef.current.src = base64Image;
      }

      // Send frame for analysis
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

  const toggleCapturing = () => {
    if (!isCapturing) {
      toast({
        title: "Starting Analysis",
        description: "Beginning automatic frame analysis",
      });
    } else {
      toast({
        title: "Stopping Analysis",
        description: "Frame analysis paused",
      });
    }
    setIsCapturing(!isCapturing);
  };

  useEffect(() => {
    if (!isCapturing) return;

    console.log('Starting capture loop');
    
    // Initial capture
    captureFrame();
    
    // Create the capture loop
    const intervalId = setInterval(async () => {
      await captureFrame();
    }, MIN_INTERVAL);

    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [isCapturing]);

  return (
    <div className="relative w-full h-full bg-black/20 rounded-md overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          ref={imageRef}
          className="w-full h-full object-contain"
          alt="Live Feed"
          src="https://via.assets.so/img.jpg?w=400&h=150&tc=blue&bg=#cecece&t=TEST IMAGE"
        />
      </div>
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={toggleCapturing}
          variant={isCapturing ? "destructive" : "default"}
          size="sm"
          className="gap-2"
        >
          {isCapturing ? (
            <>
              <Pause className="w-4 h-4" />
              Stop Analysis
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start Analysis
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default VideoFeed;
