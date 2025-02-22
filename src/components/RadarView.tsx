
import React, { useState, useEffect } from 'react';

const RadarView = () => {
  const [currentImage, setCurrentImage] = useState(1);
  const [totalImages] = useState(10); // Assuming there are 10 images, adjust as needed

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev % totalImages) + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [totalImages]);

  return (
    <div className="relative w-full h-full bg-black/20 rounded-md overflow-hidden">
      <img
        src={`/radar/${currentImage}.jpeg`}
        alt={`Radar View ${currentImage}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder.svg';
        }}
      />
    </div>
  );
};

export default RadarView;
