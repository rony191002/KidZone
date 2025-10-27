import API from './api'

export const likeService = {
  async likeContent(contentId) {
    try {
      const response = await API.post(`/content/${contentId}/like`)
      console.log('Like successful:', response.data)
      return response.data
    } catch (error) {
      console.error('Like service error:', error.response?.data || error.message)
      // Re-throw the error so the component can handle it
      throw error
    }
  },

  async unlikeContent(contentId) {
    try {
      const response = await API.delete(`/content/${contentId}/like`)
      console.log('Unlike successful:', response.data)
      return response.data
    } catch (error) {
      console.error('Unlike service error:', error.response?.data || error.message)
      // Re-throw the error so the component can handle it
      throw error
    }
  }
}