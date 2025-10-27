// src/components/VideoPlayer.jsx
import React from "react";

const VideoPlayer = ({ videoUrl, title, description }) => {
  return (
    <div className="w-full max-w-3xl mx-auto my-6">
      <video
        src={videoUrl}
        controls
        className="w-full rounded-2xl shadow-md"
        poster=""
      />
      <h2 className="text-xl font-semibold mt-3">{title}</h2>
      {description && <p className="text-gray-600 mt-1">{description}</p>}
    </div>
  );
};

export default VideoPlayer;
