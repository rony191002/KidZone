import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { kidService } from '../services/kidService'
import { likeService } from '../services/likeService'
import KidModePinModal from '../components/KidModePinModal'

const KidPage = () => {
  const { user, isKidMode } = useAuth()
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [showExitModal, setShowExitModal] = useState(false)
  const [likingInProgress, setLikingInProgress] = useState(new Set())
  const [selectedImage, setSelectedImage] = useState(null) // 🆕 For fullscreen image modal

  useEffect(() => {
    if (isKidMode) {
      fetchKidContent()
    }
  }, [isKidMode])

  const fetchKidContent = async () => {
    try {
      const response = await kidService.getContent()
      setContent(response.content)
      console.log('Fetched kid content:', response.content)
    } catch (error) {
      console.error('Error fetching kid content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (contentId) => {
    if (likingInProgress.has(contentId)) {
      console.log('Like action already in progress for:', contentId)
      return
    }

    setLikingInProgress(prev => new Set(prev).add(contentId))

    const contentItem = content.find(item => item._id === contentId)
    const isCurrentlyLiked = contentItem?.isLiked || false
    const currentLikesCount = contentItem?.likesCount || 0

    try {
      // ✅ OPTIMISTIC UI UPDATE
      setContent(prevContent =>
        prevContent.map(item =>
          item._id === contentId
            ? {
                ...item,
                isLiked: !isCurrentlyLiked,
                likesCount: isCurrentlyLiked
                  ? Math.max(0, item.likesCount - 1)
                  : item.likesCount + 1
              }
            : item
        )
      )

      if (isCurrentlyLiked) {
        await likeService.unlikeContent(contentId)
      } else {
        await likeService.likeContent(contentId)
      }

      console.log(`Successfully ${isCurrentlyLiked ? 'unliked' : 'liked'} content:`, contentId)
      await fetchKidContent()
    } catch (error) {
      console.error('Error updating like:', error)
      setContent(prevContent =>
        prevContent.map(item =>
          item._id === contentId
            ? {
                ...item,
                isLiked: isCurrentlyLiked,
                likesCount: currentLikesCount
              }
            : item
        )
      )

      if (error.response?.status === 409) {
        alert('Please wait a moment before trying again.')
      } else if (error.response?.status === 400) {
        alert('Unable to like this content. Please refresh the page.')
      } else {
        alert('Failed to update like. Please try again.')
      }
    } finally {
      setLikingInProgress(prev => {
        const newSet = new Set(prev)
        newSet.delete(contentId)
        return newSet
      })
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `${minutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }
  }

  if (!isKidMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">🎮 Welcome to KidZone! 🎮</h1>
          <p className="text-lg">Please enter Kid Mode to see fun content!</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading fun content... 🎉</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🌈 Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xl">🎮</span>
              </div>
              <h1 className="text-2xl font-bold text-blue-900">KidZone Fun</h1>
            </div>
            <button
              onClick={() => setShowExitModal(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors shadow-sm"
            >
              Exit Kid Mode
            </button>
          </div>
        </div>
      </div>

      {/* 📺 News Feed */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {content.length > 0 ? (
          <div className="space-y-4">
            {content.map(item => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden post-card"
              >
                {/* 👤 Post Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {item.creator?.username?.charAt(0).toUpperCase() || '🎬'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.creator?.username || 'Unknown Creator'}
                      </h3>
                      <p className="text-xs text-gray-500">{formatTime(item.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* 🎨 Post Content */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h2>
                  {item.description && (
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* 🎬 Media */}
                  <div className="rounded-lg overflow-hidden mb-4 bg-gray-50">
                    {item.type === 'video' ? (
                      <video
                        src={item.mediaUrl}
                        className="w-full h-auto max-h-[80vh] object-contain bg-black"
                        controls
                        poster={item.thumbnailUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-auto max-h-[80vh] object-contain bg-black cursor-pointer"
                        onClick={() => setSelectedImage(item.mediaUrl)} // 🆕 opens modal
                      />
                    )}
                  </div>

                  {/* ❤️ Stats */}
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <span className="flex items-center space-x-1">
                      <span className="text-red-500">❤️</span>
                      <span>
                        {item.likesCount} {item.likesCount === 1 ? 'like' : 'likes'}
                      </span>
                    </span>
                    <span className="mx-2">•</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {item.category}
                    </span>
                  </div>

                  {/* 🔘 Like Button */}
                  <div className="flex border-t border-gray-100 pt-3">
                    <button
                      onClick={() => handleLike(item._id)}
                      disabled={likingInProgress.has(item._id)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg transition-all duration-300 ${
                        item.isLiked
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-600 hover:bg-gray-50'
                      } ${likingInProgress.has(item._id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`text-lg transition-all duration-300 ${
                          item.isLiked ? 'scale-125 heart-animation' : ''
                        }`}
                      >
                        {likingInProgress.has(item._id)
                          ? '⏳'
                          : item.isLiked
                          ? '❤️'
                          : '🤍'}
                      </span>
                      <span
                        className={`font-medium ${
                          item.isLiked ? 'text-red-500' : 'text-gray-600'
                        }`}
                      >
                        {likingInProgress.has(item._id)
                          ? 'Loading...'
                          : item.isLiked
                          ? 'Liked'
                          : 'Like'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 💤 Empty State
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No content available</h2>
            <p className="text-gray-600 mb-6">
              Ask your parent to subscribe to some awesome creators!
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto"></div>
          </div>
        )}
      </div>

      {/* 🔒 Exit Modal */}
      <KidModePinModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        mode="exit"
      />

      {/* 🖼️ Fullscreen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white text-gray-700 rounded-full p-2 hover:bg-gray-200"
            >
              ✖
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default KidPage
