
import React, { useRef, useState } from 'react';
import DashboardSection from '@/components/DashboardSection';
import VideoFeed from '@/components/VideoFeed';
import RadarView from '@/components/RadarView';
import MessageFeed from '@/components/MessageFeed';
import TikTokFeed from '@/components/TikTokFeed';

interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface RadarDot {
  x: number;
  y: number;
  size: number;
  type: 'BIRD' | 'SMALL_PLANE' | 'BIG_PLANE';
  boundingBox: BoundingBox;
}

const Index = () => {
  const [radarDots, setRadarDots] = useState<RadarDot[]>([]);
  const [detectedObjects, setDetectedObjects] = useState<RadarDot[]>([]);
  const messageFeedRef = useRef<any>(null);

  const handleNewFrame = (imageDescription: string, imageUrl: string) => {
    if (messageFeedRef.current) {
      messageFeedRef.current.addMessage(imageDescription, imageUrl);
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-bg text-white p-4">
      <div className="grid grid-cols-2 gap-4 max-w-[1800px] mx-auto" style={{ height: "calc(100vh - 2rem)" }}>
        <DashboardSection title="Current View" className="h-[calc(50vh-2rem)]">
          <VideoFeed 
            onNewFrame={handleNewFrame} 
            detectedObjects={detectedObjects.map(dot => ({
              type: dot.type,
              boundingBox: dot.boundingBox
            }))}
          />
        </DashboardSection>
        
        <DashboardSection title="Message Feed" className="h-[calc(50vh-2rem)]">
          <MessageFeed 
            ref={messageFeedRef}
            onRadarUpdate={setRadarDots}
            onBoundingBoxesUpdate={setDetectedObjects}
          />
        </DashboardSection>
        
        <DashboardSection title="Radar View" className="h-[calc(50vh-2rem)]">
          <RadarView dots={radarDots} />
        </DashboardSection>
        
        <DashboardSection title="Entertainment" className="h-[calc(50vh-2rem)]">
          <TikTokFeed />
        </DashboardSection>
      </div>
    </div>
  );
};

export default Index;
