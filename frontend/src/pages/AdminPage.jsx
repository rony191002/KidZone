import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { adminService } from '../services/adminService'

const AdminPage = () => {
  const { user } = useAuth()
  const [pendingContent, setPendingContent] = useState([])
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})
  const [rejectionReason, setRejectionReason] = useState('')
  const [previewContent, setPreviewContent] = useState(null)
  const [rejectionReasons, setRejectionReasons] = useState({})

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData()
    }
  }, [user, activeTab])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'pending') {
        const response = await adminService.getPendingContent()
        setPendingContent(response.content || [])
      }
      
      const statsResponse = await adminService.getAdminStats()
      setStats(statsResponse.stats)
    } catch (error) {
      console.error('Error fetching admin data:', error)
      alert('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (contentId) => {
    setActionLoading(prev => ({ ...prev, [contentId]: 'approve' }))
    try {
      await adminService.approveContent(contentId)
      alert('Content approved successfully!')
      fetchAdminData() // Refresh data
    } catch (error) {
      console.error('Error approving content:', error)
      alert('Failed to approve content')
    } finally {
      setActionLoading(prev => ({ ...prev, [contentId]: null }))
    }
  }

  const handleReject = async (contentId, reason) => {
    if (!reason || !reason.trim()) {
      alert('Please provide a rejection reason')
      return
    }

    setActionLoading(prev => ({ ...prev, [contentId]: 'reject' }))
    try {
      await adminService.rejectContent(contentId, reason)
      alert('Content rejected successfully!')
      setRejectionReasons(prev => ({ ...prev, [contentId]: '' }))
      fetchAdminData() // Refresh data
    } catch (error) {
      console.error('Error rejecting content:', error)
      alert('Failed to reject content')
    } finally {
      setActionLoading(prev => ({ ...prev, [contentId]: null }))
    }
  }

  const handleRejectionReasonChange = (contentId, reason) => {
    setRejectionReasons(prev => ({
      ...prev,
      [contentId]: reason
    }))
  }

  const openPreview = (content) => {
    setPreviewContent(content)
  }

  const closePreview = () => {
    setPreviewContent(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">Admin privileges required to access this page.</p>
        </div>
      </div>
    )
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Review and manage content approval</p>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalContent}</div>
              <div className="text-sm text-gray-600">Total Content</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingContent}</div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.approvedContent}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejectedContent}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Review ({stats?.pendingContent || 0})
              </button>
            </nav>
          </div>

          {/* Content List */}
          <div className="p-6">
            {activeTab === 'pending' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Content Pending Approval</h2>
                {pendingContent.length > 0 ? (
                  <div className="space-y-6">
                    {pendingContent.map(content => (
                      <div key={content._id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                          {/* Media Preview */}
                          <div className="flex-shrink-0">
                            <div className="relative">
                              {content.type === 'video' ? (
                                <video
                                  src={content.mediaUrl}
                                  className="w-64 h-36 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                                  poster={content.thumbnailUrl}
                                  onClick={() => openPreview(content)}
                                />
                              ) : (
                                <img
                                  src={content.mediaUrl}
                                  alt={content.title}
                                  className="w-64 h-36 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => openPreview(content)}
                                />
                              )}
                              <button
                                onClick={() => openPreview(content)}
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all rounded"
                              >
                                <span className="bg-white bg-opacity-80 rounded-full p-2 text-sm">
                                  👁️ Preview
                                </span>
                              </button>
                            </div>
                            <button
                              onClick={() => openPreview(content)}
                              className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 rounded text-sm transition-colors"
                            >
                              {content.type === 'video' ? '🎬 Play Video' : '🖼️ View Image'}
                            </button>
                          </div>

                          {/* Content Details */}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {content.title}
                            </h3>
                            {content.description && (
                              <p className="text-gray-600 mb-2">{content.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {content.category}
                              </span>
                              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                {content.type}
                              </span>
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                By: {content.creator?.username || 'Unknown'}
                              </span>
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                                {content.creator?.email || 'No email'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Uploaded: {formatDate(content.createdAt)}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-3 min-w-[200px]">
                            <button
                              onClick={() => handleApprove(content._id)}
                              disabled={actionLoading[content._id]}
                              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {actionLoading[content._id] === 'approve' ? 'Approving...' : '✅ Approve'}
                            </button>
                            
                            <div className="space-y-2">
                              <textarea
                                placeholder="Rejection reason (required)"
                                value={rejectionReasons[content._id] || ''}
                                onChange={(e) => handleRejectionReasonChange(content._id, e.target.value)}
                                className="w-full border rounded px-2 py-1 text-sm resize-none"
                                rows="2"
                              />
                              <button
                                onClick={() => handleReject(content._id, rejectionReasons[content._id])}
                                disabled={actionLoading[content._id] || !rejectionReasons[content._id]?.trim()}
                                className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                              >
                                {actionLoading[content._id] === 'reject' ? 'Rejecting...' : '❌ Reject'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Pending Content</h3>
                    <p className="text-gray-600">All content has been reviewed and approved!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Preview Modal */}
      {previewContent && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{previewContent.title}</h3>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-4 max-h-[70vh] overflow-auto">
              {previewContent.type === 'video' ? (
                <div className="flex flex-col items-center">
                  <video
                    src={previewContent.mediaUrl}
                    className="w-full max-w-2xl rounded"
                    controls
                    autoPlay
                    poster={previewContent.thumbnailUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <p className="text-sm text-gray-600 mt-2">Video Preview - Use controls to play/pause</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <img
                    src={previewContent.mediaUrl}
                    alt={previewContent.title}
                    className="max-w-full max-h-[60vh] object-contain rounded"
                  />
                  <p className="text-sm text-gray-600 mt-2">Image Preview</p>
                </div>
              )}
              
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h4 className="font-semibold mb-2">Content Details:</h4>
                <p><strong>Title:</strong> {previewContent.title}</p>
                {previewContent.description && (
                  <p><strong>Description:</strong> {previewContent.description}</p>
                )}
                <p><strong>Category:</strong> {previewContent.category}</p>
                <p><strong>Type:</strong> {previewContent.type}</p>
                <p><strong>Creator:</strong> {previewContent.creator?.username || 'Unknown'} ({previewContent.creator?.email || 'No email'})</p>
                <p><strong>Uploaded:</strong> {formatDate(previewContent.createdAt)}</p>
              </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    handleApprove(previewContent._id)
                    closePreview()
                  }}
                  disabled={actionLoading[previewContent._id]}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {actionLoading[previewContent._id] === 'approve' ? 'Approving...' : 'Approve Content'}
                </button>
                <button
                  onClick={closePreview}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage