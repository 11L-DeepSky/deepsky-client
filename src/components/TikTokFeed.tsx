
import React from 'react';

const TikTokFeed = () => {
  return (
    <div className="relative w-full h-full bg-black/20 rounded-md overflow-hidden">
      <iframe
        src="https://www.youtube.com/embed/2oy5F4m_g6c"
        title="Entertainment Feed"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default TikTokFeed;
