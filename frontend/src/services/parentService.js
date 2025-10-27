//services/parentService.js
import API from './api'

export const parentService = {
  async subscribe(creatorId) {
    const response = await API.post('/parents/subscribe', { creatorId })
    return response.data
  },

  async unsubscribe(creatorId) {
    const response = await API.post('/parents/unsubscribe', { creatorId })
    return response.data
  },

  async getSubscriptions() {
    const response = await API.get('/parents/subscriptions')
    return response.data
  }
}