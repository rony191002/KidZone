//src/components/Navbar.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import KidModePinModal from './KidModePinModal'

const Navbar = () => {
  const { user, logout, isKidMode } = useAuth()
  const [showKidModeModal, setShowKidModeModal] = useState(false)

  const handleLogout = () => {
    logout()
  }

  if (isKidMode) {
    return (
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold">
              🎮 KidZone
            </Link>
            <div className="font-semibold">Kid Mode Active</div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-800 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16 text-white">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight hover:text-cyan-300 transition-colors"
            >
              KidZone
            </Link>

            {/* Links */}
            <div className="flex items-center space-x-4 font-semibold">
              {user ? (
                <>
                  {/* Hide welcome on small screens */}
                  <span className="hidden sm:inline text-cyan-100">
                    Welcome, {user.username}!
                  </span>

                  {user.role === 'parent' && (
                    <button
                      onClick={() => setShowKidModeModal(true)}
                      className="bg-cyan-500 text-blue-900 px-3 sm:px-4 py-2 rounded-lg hover:bg-cyan-400 transition-all text-sm sm:text-base"
                    >
                      Enter Kid Mode
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-all text-sm sm:text-base"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-x-3">
                  <Link
                    to="/login"
                    className="text-cyan-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-cyan-400 text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-300 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Kid Mode Modal */}
      <KidModePinModal
        isOpen={showKidModeModal}
        onClose={() => setShowKidModeModal(false)}
        mode="enter"
      />
    </>
  )
}

export default Navbar
