
import React from 'react';

const LiveFeed = () => {
  return (
    <div className="relative w-full h-full bg-black/20 rounded-md overflow-hidden">
      <iframe
        src="https://player.twitch.tv/?channel=izakooo&parent=127.0.0.1&autoplay=true"
        height="100%"
        width="100%"
        allowFullScreen
        className="absolute inset-0"
      />
    </div>
  );
};

export default LiveFeed;
