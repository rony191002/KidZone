//src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isKidMode, setIsKidMode] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const userData = await authService.getCurrentUser()
      if (userData) {
        setUser(userData)
        // Sync kid mode with backend user data
        setIsKidMode(userData.mode === 'kid')
      } else {
        setUser(null)
        setIsKidMode(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setIsKidMode(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      setUser(response.user)
      setIsKidMode(response.user.mode === 'kid') // Sync mode after login
      return response
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      setUser(response.user)
      setIsKidMode(response.user.mode === 'kid') // Sync mode after register
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      setIsKidMode(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const enterKidMode = async (pin) => {
    try {
      const response = await authService.switchToKidMode(pin)
      // Refresh user data to get updated mode from backend
      await checkAuthStatus()
      return response
    } catch (error) {
      throw error
    }
  }

  const exitKidMode = async (pin) => {
    try {
      const response = await authService.switchToParentMode(pin)
      // Refresh user data to get updated mode from backend
      await checkAuthStatus()
      return response
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    isKidMode,
    enterKidMode,
    exitKidMode,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}