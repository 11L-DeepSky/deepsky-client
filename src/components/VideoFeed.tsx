
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface DetectedObject {
  type: 'BIRD' | 'SMALL_PLANE' | 'BIG_PLANE';
  boundingBox: BoundingBox;
}

interface VideoFeedProps {
  onNewFrame?: (imageDescription: string, imageData: string) => void;
}

const VideoFeed = ({ onNewFrame }: VideoFeedProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const lastCaptureTime = useRef<number>(0);
  const isProcessing = useRef<boolean>(false);
  const { toast } = useToast();
  const MIN_INTERVAL = 3000;

  const captureFrame = async () => {
    const now = Date.now();
    if (isProcessing.current || now - lastCaptureTime.current < MIN_INTERVAL) {
      return;
    }

    isProcessing.current = true;
    
    try {
      const response = await fetch('https://cd2af9606eaed8f7f92d2baab92cde2e.loophole.site/frame');
      const data = await response.json();
      
      if (data && data.frame) {
        const imageUrl = data.frame.startsWith('data:') 
          ? data.frame 
          : `data:image/jpeg;base64,${data.frame}`;

        if (imageRef.current) {
          imageRef.current.src = imageUrl;
        }

        if (onNewFrame) {
          try {
            await onNewFrame(
              'Analyzing current frame for potential aircraft or obstacles.',
              imageUrl
            );
            console.log('Frame successfully analyzed');
            lastCaptureTime.current = Date.now();
          } catch (error) {
            console.error('Error from Supabase analysis:', error);
          }
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
      isProcessing.current = false;
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
    captureFrame();
  }, []);

  useEffect(() => {
    if (!isCapturing) return;

    console.log('Starting capture loop');
    
    const intervalId = setInterval(async () => {
      await captureFrame();
    }, MIN_INTERVAL);

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
        />
        {detectedObjects.map((obj, index) => (
          <div
            key={index}
            className="absolute border-2 border-yellow-400 bg-yellow-400/10"
            style={{
              left: `${obj.boundingBox.x1}%`,
              top: `${obj.boundingBox.y1}%`,
              width: `${obj.boundingBox.x2 - obj.boundingBox.x1}%`,
              height: `${obj.boundingBox.y2 - obj.boundingBox.y1}%`,
            }}
          >
            <span className="absolute top-0 left-0 bg-yellow-400 text-black text-xs px-1 rounded-br">
              {obj.type}
            </span>
          </div>
        ))}
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
