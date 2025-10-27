//services/kidService.js
import API from './api'

export const kidService = {
  async getContent() {
    const response = await API.get('/kids/content')
    return response.data
  }
}