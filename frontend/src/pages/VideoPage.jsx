import React, { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { kidService } from '../services/kidService'

const VideoPage = () => {
  const { id } = useParams()
  const { isKidMode } = useAuth()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // In a real app, you'd have an endpoint to get specific content by ID
    // For now, we'll fetch all content and find the matching one
    const fetchContent = async () => {
      try {
        const response = await kidService.getContent()
        const foundContent = response.content.find(item => item._id === id)
        
        if (foundContent) {
          setContent(foundContent)
        } else {
          setError('Content not found')
        }
      } catch (err) {
        console.error('Error fetching content:', err)
        setError('Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchContent()
    }
  }, [id])

  // Redirect if not in kid mode (for kid-specific content)
  if (!isKidMode) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading content...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
          <p className="text-gray-600">The content you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Media Display */}
          <div className="bg-black flex justify-center">
            {content.type === 'video' ? (
              <video
                src={content.mediaUrl}
                controls
                className="w-full h-auto max-h-[70vh]"
                poster={content.thumbnailUrl}
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={content.mediaUrl}
                alt={content.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            )}
          </div>

          {/* Content Details */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {content.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {content.category}
                  </span>
                  <span>By: {content.creator?.username || 'Unknown Creator'}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-700">
                  {content.likesCount} ❤️
                </div>
              </div>
            </div>

            {content.description && (
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {content.description}
              </p>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Uploaded on: {new Date(content.createdAt).toLocaleDateString()}</span>
                <span>{content.type === 'video' ? 'Video' : 'Image'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPage