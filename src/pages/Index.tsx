import React, {useRef, useState} from 'react';
import DashboardSection from '@/components/DashboardSection';
import VideoFeed from '@/components/VideoFeed';
import RadarView from '@/components/RadarView';
import MessageFeed from '@/components/MessageFeed';
import LiveFeed from '@/components/LiveFeed';
import {RadarDot} from "@/types.ts";

const Index = () => {
  const [radarDots, setRadarDots] = useState<RadarDot[]>([]);
  const messageFeedRef = useRef<any>(null);

  const handleNewFrame = async (imageDescription: string, imageUrl: string): Promise<void> => {
    if (messageFeedRef.current) {
      await messageFeedRef.current.addMessage(imageDescription, imageUrl);
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-bg text-white p-4">
      <div className="grid grid-cols-2 gap-4 max-w-[1800px] mx-auto" style={{height: "calc(100vh - 2rem)"}}>
        <DashboardSection title="Last Analyzed Frame" className="h-[calc(50vh-2rem)]">
          <VideoFeed onNewFrame={handleNewFrame}/>
        </DashboardSection>

        <DashboardSection title="Message Feed" className="h-[calc(50vh-2rem)]">
          <MessageFeed
            ref={messageFeedRef}
            onRadarUpdate={setRadarDots}
          />
        </DashboardSection>

        <DashboardSection title="Radar View" className="h-[calc(50vh-2rem)]">
          <RadarView dots={radarDots}/>
        </DashboardSection>

        <DashboardSection title="Live Feed" className="h-[calc(50vh-2rem)]">
          <LiveFeed/>
        </DashboardSection>
      </div>
    </div>
  );
};

export default Index;
