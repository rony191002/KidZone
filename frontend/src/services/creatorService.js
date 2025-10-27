//services/creatorService.js
import API from './api'

export const creatorService = {
  async getContent() {
    const response = await API.get('/creators/content')
    return response.data
  },

  async getSubscribers() {
    const response = await API.get('/creators/subscribers')
    return response.data
  },

  async getAllCreators() {
    const response = await API.get('/creators/all')
    return response.data
  },

  async uploadContent(formData) {
    const response = await API.post('/creators/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // UPDATED: Public profile endpoint
  async getCreatorProfile(creatorId) {
    const response = await API.get(`/creators/profile/${creatorId}`)
    return response.data
  }
}