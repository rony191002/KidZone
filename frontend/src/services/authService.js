//services/authService.js
import API from './api'

export const authService = {
  async login(email, password) {
    const response = await API.post('/auth/login', { email, password })
    return response.data
  },

  async register(userData) {
    const response = await API.post('/auth/register', userData)
    return response.data
  },

  async logout() {
    const response = await API.post('/auth/logout')
    return response.data
  },

  async getCurrentUser() {
    try {
      const response = await API.get('/auth/me')
      return response.data.user
    } catch (error) {
      // Return null instead of throwing error to prevent infinite loops
      if (error.response?.status === 401) {
        return null
      }
      throw error
    }
  },

  async switchToKidMode(pin) {
    const response = await API.post('/parents/switch-to-kid-mode', { pin })
    return response.data
  },

  async switchToParentMode(pin) {
    const response = await API.post('/parents/switch-to-parent-mode', { pin })
    return response.data
  }
}