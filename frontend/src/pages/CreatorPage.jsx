//src/pages/CreatorPage.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { creatorService } from '../services/creatorService'

const CreatorPage = () => {
  const { user } = useAuth()
  const [content, setContent] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'educational',
    type: 'video'
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [contentRes, subscribersRes] = await Promise.all([
        creatorService.getContent(),
        creatorService.getSubscribers()
      ])
      setContent(contentRes.content || [])
      setSubscribers(subscribersRes.subscribers || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadChange = (e) => {
    setUploadForm({
      ...uploadForm,
      [e.target.name]: e.target.value
    })
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedFile) {
      alert('Please select a file first')
      return
    }

    if (!uploadForm.title) {
      alert('Please enter a title')
      return
    }

    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('title', uploadForm.title)
    formData.append('description', uploadForm.description)
    formData.append('category', uploadForm.category)
    formData.append('type', uploadForm.type)

    try {
      const response = await creatorService.uploadContent(formData)
      alert('Content uploaded successfully! It is now pending admin approval.')
      setShowUploadModal(false)
      setUploadForm({
        title: '',
        description: '',
        category: 'educational',
        type: 'video'
      })
      setSelectedFile(null)
      fetchData() // Refresh content
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed: ' + (error.response?.data?.message || 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  const getStatusBadge = (item) => {
    if (item.status === 'approved') {
      return 'bg-green-100 text-green-800'
    } else if (item.status === 'rejected') {
      return 'bg-red-100 text-red-800'
    } else {
      return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusText = (item) => {
    if (item.status === 'approved') {
      return 'Approved'
    } else if (item.status === 'rejected') {
      return 'Rejected'
    } else {
      return 'Pending Approval'
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Creator Dashboard</h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Upload Content
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Content Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Content</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">{content.length}</h3>
                <p className="text-sm text-blue-600">Total Content</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">
                  {content.reduce((acc, item) => acc + item.likesCount, 0)}
                </h3>
                <p className="text-sm text-green-600">Total Likes</p>
              </div>
            </div>
          </div>

          {/* Subscribers */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Subscribers</h2>
            {subscribers.length > 0 ? (
              <div className="space-y-3">
                {subscribers.map(subscriber => (
                  <div key={subscriber._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span>👨‍👩‍👧‍👦</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{subscriber.username}</h3>
                      <p className="text-sm text-gray-600">{subscriber.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No subscribers yet.</p>
            )}
          </div>
        </div>

        {/* Content List */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Content</h2>
          {content.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.map(item => (
                <div key={item._id} className="border rounded-lg p-4">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded mb-2 flex items-center justify-center">
                      <span className="text-gray-500">No thumbnail</span>
                    </div>
                  )}
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">{item.likesCount} likes</span>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(item)}`}>
                      {getStatusText(item)}
                    </span>
                  </div>
                  {item.status === 'rejected' && item.rejectionReason && (
                    <p className="text-xs text-red-600 mt-2">
                      Reason: {item.rejectionReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't uploaded any content yet.</p>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Upload Content</h2>
            <form onSubmit={handleUploadSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={uploadForm.title}
                    onChange={handleUploadChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={uploadForm.description}
                    onChange={handleUploadChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={uploadForm.category}
                    onChange={handleUploadChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  >
                    <option value="educational">Educational</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="music">Music</option>
                    <option value="art">Art</option>
                    <option value="science">Science</option>
                    <option value="math">Math</option>
                    <option value="reading">Reading</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content Type</label>
                  <select
                    name="type"
                    value={uploadForm.type}
                    onChange={handleUploadChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  >
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">File *</label>
                  <input
                    type="file"
                    accept={uploadForm.type === 'video' ? 'video/*' : 'image/*'}
                    onChange={handleFileSelect}
                    className="mt-1 w-full"
                    required
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-1">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> All content must be approved by an admin before it appears to kids.
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false)
                    setSelectedFile(null)
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile || !uploadForm.title}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Content'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreatorPage