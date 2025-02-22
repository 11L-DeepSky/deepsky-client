
import React from 'react';
import DashboardSection from '@/components/DashboardSection';
import VideoFeed from '@/components/VideoFeed';
import RadarView from '@/components/RadarView';
import MessageFeed from '@/components/MessageFeed';
import TikTokFeed from '@/components/TikTokFeed';

const Index = () => {
  return (
    <div className="min-h-screen bg-dashboard-bg text-white p-4">
      <div className="grid grid-cols-2 gap-4 max-w-[1800px] mx-auto" style={{ height: "calc(100vh - 2rem)" }}>
        <DashboardSection title="Video Feed" className="h-[calc(50vh-2rem)]">
          <VideoFeed />
        </DashboardSection>
        
        <DashboardSection title="Message Feed" className="h-[calc(50vh-2rem)]">
          <MessageFeed />
        </DashboardSection>
        
        <DashboardSection title="Radar View" className="h-[calc(50vh-2rem)]">
          <RadarView />
        </DashboardSection>
        
        <DashboardSection title="Entertainment" className="h-[calc(50vh-2rem)]">
          <TikTokFeed />
        </DashboardSection>
      </div>
    </div>
  );
};

export default Index;
