import API from './api'

export const adminService = {
  async getPendingContent() {
    const response = await API.get('/admin/content/pending')
    return response.data
  },

  async getAllContent(status = null) {
    const url = status ? `/admin/content/all?status=${status}` : '/admin/content/all'
    const response = await API.get(url)
    return response.data
  },

  async getAdminStats() {
    const response = await API.get('/admin/stats')
    return response.data
  },

  async approveContent(contentId) {
    const response = await API.patch(`/admin/content/${contentId}/approve`)
    return response.data
  },

  async rejectContent(contentId, reason) {
    const response = await API.patch(`/admin/content/${contentId}/reject`, { reason })
    return response.data
  }
}