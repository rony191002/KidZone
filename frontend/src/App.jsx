
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ParentPage from './pages/ParentPage'
import CreatorPage from './pages/CreatorPage'
import KidPage from './pages/KidPage'
import VideoPage from './pages/VideoPage'
import CreatorProfilePage from './pages/CreatorProfilePage'
import AdminPage from './pages/AdminPage' 
import Navbar from './components/Navbar'

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-xl">Loading...</div>
  </div>
)

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null, requireKidMode = false }) => {
  const { user, loading, isKidMode } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  if (requireKidMode && !isKidMode) {
    return <Navigate to="/" replace />
  }

  return children
}

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (user) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'parent') {
      return <Navigate to="/parent" replace />
    } else if (user.role === 'creator') {
      return <Navigate to="/creator" replace />
    } else if (user.role === 'admin') {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/" replace />
  }

  return children
}

function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/parent" 
          element={
            <ProtectedRoute requiredRole="parent">
              <ParentPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/creator" 
          element={
            <ProtectedRoute requiredRole="creator">
              <CreatorPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/kid" 
          element={
            <ProtectedRoute requireKidMode={true}>
              <KidPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/video/:id" 
          element={
            <ProtectedRoute requireKidMode={true}>
              <VideoPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Creator Profile Route */}
        <Route 
          path="/creator/:creatorId" 
          element={
            <ProtectedRoute>
              <CreatorProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* Admin Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          } 
        />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App