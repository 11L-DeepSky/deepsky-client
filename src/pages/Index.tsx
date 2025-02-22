
import React, { useState } from 'react';
import DashboardSection from '@/components/DashboardSection';
import VideoFeed from '@/components/VideoFeed';
import RadarView from '@/components/RadarView';
import MessageFeed from '@/components/MessageFeed';
import TikTokFeed from '@/components/TikTokFeed';

interface RadarDot {
  x: number;
  y: number;
  size: number;
  type: 'BIRD' | 'SMALL_PLANE' | 'BIG_PLANE';
}

const Index = () => {
  const [radarDots, setRadarDots] = useState<RadarDot[]>([]);
  const [messageFeedRef, setMessageFeedRef] = useState<any>(null);

  const handleNewFrame = (imageDescription: string) => {
    if (messageFeedRef) {
      messageFeedRef.addMessage(imageDescription);
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-bg text-white p-4">
      <div className="grid grid-cols-2 gap-4 max-w-[1800px] mx-auto" style={{ height: "calc(100vh - 2rem)" }}>
        <DashboardSection title="Video Feed" className="h-[calc(50vh-2rem)]">
          <VideoFeed onNewFrame={handleNewFrame} />
        </DashboardSection>
        
        <DashboardSection title="Message Feed" className="h-[calc(50vh-2rem)]">
          <MessageFeed 
            ref={setMessageFeedRef}
            onRadarUpdate={setRadarDots} 
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
