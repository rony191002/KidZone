//src/components/VideoCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const VideoCard = ({ video }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/video/${video._id}`}>
        <div className="relative">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
            {video.type === 'video' ? '🎬' : '🖼️'}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/video/${video._id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">
            {video.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2">{video.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{video.category}</span>
          <span className="text-sm text-gray-500">
            {video.likesCount} likes
          </span>
        </div>
      </div>
    </div>
  )
}

export default VideoCard