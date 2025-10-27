//src/pages/ParentPage.jsx
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
        creatorService.getAllCreators()
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
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error subscribing:', error)
      setError('Failed to subscribe')
    }
  }

  const handleUnsubscribe = async (creatorId) => {
    try {
      await parentService.unsubscribe(creatorId)
      fetchData() // Refresh data
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Parent Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Subscriptions Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Subscriptions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Subscriptions</h2>
            {subscriptions.length > 0 ? (
              <div className="space-y-4">
                {subscriptions.map(creator => (
                  <SubscriptionCard
                    key={creator._id}
                    creator={creator}
                    onUnsubscribe={handleUnsubscribe}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">You haven't subscribed to any creators yet.</p>
            )}
          </div>

          {/* Available Creators */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Available Creators</h2>
            {creators.length > 0 ? (
              <div className="space-y-4">
                {creators.map(creator => (
                  <div key={creator._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Link 
                      to={`/creator/${creator._id}`}
                      className="flex items-center space-x-3 flex-1"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span>🎬</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                          {creator.username}
                        </h3>
                        <p className="text-sm text-gray-600">{creator.bio || 'Educational content creator'}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleSubscribe(creator._id)}
                      disabled={subscriptions.some(sub => sub._id === creator._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:bg-gray-400 transition-colors ml-4"
                    >
                      {subscriptions.some(sub => sub._id === creator._id) ? 'Subscribed' : 'Subscribe'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No creators available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentPage