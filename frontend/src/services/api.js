//services/api.js

import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:7000/api',
  withCredentials: true,
})

// Request interceptor
API.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - REMOVE automatic redirect
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't automatically redirect - let components handle auth errors
    return Promise.reject(error)
  }
)

export default API