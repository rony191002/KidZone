
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { parentService } from '../services/parentService'
import { creatorService } from '../services/creatorService'
import SubscriptionCard from '../components/SubscriptionCard'

const ParentPage = () => {
  const { user } = useAuth()
  const [subscriptions, setSubscriptions] = useState([])
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setError('')
      const [subsRes, creatorsRes] = await Promise.all([
        parentService.getSubscriptions(),
        creatorService.getAllCreators(),
      ])
      setSubscriptions(subsRes.subscriptions || [])
      setCreators(creatorsRes.creators || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (creatorId) => {
    try {
      await parentService.subscribe(creatorId)
      fetchData()
    } catch (error) {
      console.error('Error subscribing:', error)
      setError('Failed to subscribe')
    }
  }

  const handleUnsubscribe = async (creatorId) => {
    try {
      await parentService.unsubscribe(creatorId)
      fetchData()
    } catch (error) {
      console.error('Error unsubscribing:', error)
      setError('Failed to unsubscribe')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
          Parent Dashboard
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Subscriptions & Creators */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Subscriptions */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 order-2 lg:order-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">
                Your Subscriptions
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {subscriptions.length}
              </span>
            </div>
            {subscriptions.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {subscriptions.map((creator) => (
                  <SubscriptionCard
                    key={creator._id}
                    creator={creator}
                    onUnsubscribe={handleUnsubscribe}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📺</div>
                <p className="text-gray-600 mb-4">
                  You haven't subscribed to any creators yet.
                </p>
                <p className="text-sm text-gray-500">
                  Browse available creators to get started.
                </p>
              </div>
            )}
          </div>

          {/* Available Creators */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 order-1 lg:order-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">
                Available Creators
              </h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                {creators.length}
              </span>
            </div>
            {creators.length > 0 ? (
              <div className="space-y-3 sm:space-y-4 max-h-96 lg:max-h-none overflow-y-auto">
                {creators.map((creator) => {
                  const isSubscribed = subscriptions.some(
                    (sub) => sub._id === creator._id
                  )
                  return (
                    <div
                      key={creator._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors gap-3"
                    >
                      <Link
                        to={`/creator/${creator._id}`}
                        className="flex items-center space-x-3 flex-1 min-w-0"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm">🎬</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-800 hover:text-blue-600 transition-colors truncate">
                            {creator.username}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {creator.bio || 'Educational content creator'}
                          </p>
                        </div>
                      </Link>
                      <button
                        onClick={() => handleSubscribe(creator._id)}
                        disabled={isSubscribed}
                        className={`w-full sm:w-auto px-4 py-2 rounded text-sm font-medium transition-colors ${
                          isSubscribed
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isSubscribed ? (
                          <span className="flex items-center justify-center">
                            <span className="mr-1">✓</span> Subscribed
                          </span>
                        ) : (
                          'Subscribe'
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">👥</div>
                <p className="text-gray-600 mb-4">
                  No creators available yet.
                </p>
                <p className="text-sm text-gray-500">
                  Check back later for new creators.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Info */}
        <div className="lg:hidden mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-blue-500 text-lg">💡</div>
            <div>
              <h3 className="font-medium text-blue-800 text-sm">Tip</h3>
              <p className="text-blue-600 text-xs mt-1">
                Subscribe to creators to access their educational content and
                manage your subscriptions easily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentPage
