
import React from 'react';

const TikTokFeed = () => {
  return (
    <div className="relative w-full h-full bg-black/20 rounded-md overflow-hidden">
      <iframe
        src="https://www.flightradar24.com/simple?lat=52.1672&lon=20.9679&z=10"
        title="FlightRadar24 - Warsaw Chopin Airport"
        className="w-full h-full"
        style={{ border: 0 }}
        allowFullScreen
      />
    </div>
  );
};

export default TikTokFeed;
