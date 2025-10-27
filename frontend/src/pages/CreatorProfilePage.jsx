// frontend/pages/CreatorProfilePage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { creatorService } from '../services/creatorService'
import { parentService } from '../services/parentService'

const CreatorProfilePage = () => {
  const { creatorId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [creator, setCreator] = useState(null)
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(null) 

  useEffect(() => {
    if (creatorId) {
      fetchCreatorProfile()
      if (user?.role === 'parent') {
        checkSubscriptionStatus()
      }
    }
  }, [creatorId, user])

  const fetchCreatorProfile = async () => {
    try {
      setError('')
      const response = await creatorService.getCreatorProfile(creatorId)
      setCreator(response.creator)
      setContent(response.content)
    } catch (error) {
      console.error('Error fetching creator profile:', error)
      if (error.response?.status === 404) {
        setError('Creator not found')
      } else {
        setError('Failed to load creator profile')
      }
    } finally {
      setLoading(false)
    }
  }

  const checkSubscriptionStatus = async () => {
    try {
      const response = await parentService.getSubscriptions()
      const subscribed = response.subscriptions?.some(sub => sub._id === creatorId)
      setIsSubscribed(subscribed)
    } catch (error) {
      console.error('Error checking subscription:', error)
    }
  }

  const handleSubscribe = async () => {
    if (user?.role !== 'parent') {
      alert('Only parents can subscribe to creators')
      return
    }

    setActionLoading(true)
    try {
      await parentService.subscribe(creatorId)
      setIsSubscribed(true)
      setCreator(prev => prev ? { ...prev, subscriberCount: prev.subscriberCount + 1 } : null)
    } catch (error) {
      console.error('Error subscribing:', error)
      alert('Failed to subscribe. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    if (user?.role !== 'parent') {
      alert('Only parents can unsubscribe from creators')
      return
    }

    setActionLoading(true)
    try {
      await parentService.unsubscribe(creatorId)
      setIsSubscribed(false)
      setCreator(prev => prev ? { ...prev, subscriberCount: Math.max(0, prev.subscriberCount - 1) } : null)
    } catch (error) {
      console.error('Error unsubscribing:', error)
      alert('Failed to unsubscribe. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading creator profile...</div>
      </div>
    )
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Creator Not Found'}
          </h1>
          <p className="text-gray-600 mb-4">
            The creator you're looking for doesn't exist or may have been removed.
          </p>
          <button 
            onClick={() => navigate('/parent')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Parent Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/parent')}
          className="flex items-center text-blue-500 hover:text-blue-600 mb-6"
        >
          ← Back to Parent Dashboard
        </button>

        {/* Creator Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {creator.username?.charAt(0).toUpperCase() || '🎬'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{creator.username}</h1>
                <p className="text-gray-600">{creator.bio || 'Educational content creator'}</p>
                <p className="text-sm text-gray-500">{creator.email}</p>
                <p className="text-sm text-gray-500">Joined {formatDate(creator.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{creator.contentCount || 0}</div>
                <div className="text-sm text-gray-600">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{creator.subscriberCount || 0}</div>
                <div className="text-sm text-gray-600">Subscribers</div>
              </div>
              {user?.role === 'parent' && (
                <button
                  onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                  disabled={actionLoading}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    isSubscribed 
                      ? 'bg-gray-500 text-white hover:bg-gray-600' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {actionLoading ? 'Loading...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Creator's Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Creator's Content</h2>
          {content.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.map(item => (
                <div key={item._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {item.type === 'video' ? (
                    // 🟢 Playable Video
                    <video
                      src={item.mediaUrl}
                      controls
                      className="w-full h-40 object-cover rounded-t-lg"
                      poster={item.thumbnailUrl}
                    ></video>
                  ) : (
                    // 🟢 Clickable Image
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-t-lg cursor-pointer"
                      onClick={() => setSelectedImage(item.mediaUrl)}
                    />
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {item.category}
                      </span>
                      <span>❤️ {item.likesCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Content Yet</h3>
              <p className="text-gray-600">This creator hasn't uploaded any content yet.</p>
            </div>
          )}
        </div>
      </div>

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

export default CreatorProfilePage
