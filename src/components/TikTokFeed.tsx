
import React from 'react';

const TikTokFeed = () => {
  return (
    <div className="relative w-full h-full bg-black/20 rounded-md overflow-hidden">
      <iframe
        src="https://www.flightradar24.com/widget/52.17,19.78/7"
        title="FlightRadar24 - Poland"
        className="w-full h-full"
        style={{ border: 0 }}
        allowFullScreen
      />
    </div>
  );
};

export default TikTokFeed;
