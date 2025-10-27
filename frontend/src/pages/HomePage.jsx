// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const { user, isKidMode } = useAuth()
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // 🔹 Kid Mode UI
  if (isKidMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

        <div className="text-center text-white relative z-10 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg tracking-tight">
            🎉 Welcome to <span className="text-yellow-300">KidZone!</span> 🎉
          </h1>
          <p className="text-lg md:text-xl mb-10 text-cyan-100 font-medium">
            Learn, play, and grow with your favorite creators!
          </p>
          <Link
            to="/kid"
            className="bg-gradient-to-r from-yellow-300 to-cyan-300 text-blue-900 px-10 py-3 rounded-full text-xl font-extrabold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            Start Learning!
          </Link>
        </div>
      </div>
    )
  }

  // 🔹 Default HomePage (non-kid mode)
  return (
    <div
      className={`min-h-screen flex flex-col text-white relative overflow-hidden transition-colors duration-500 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-blue-900 via-cyan-800 to-blue-900'
          : 'bg-gradient-to-b from-cyan-100 via-blue-100 to-cyan-50 text-gray-900'
      }`}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent)] pointer-events-none"></div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute top-5 right-5 px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all ${
          theme === 'dark'
            ? 'bg-white/10 text-cyan-200 hover:bg-white/20'
            : 'bg-blue-200 text-blue-900 hover:bg-blue-300'
        }`}
      >
        {theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center flex-1">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
          Welcome to{' '}
          <span
            className={`${
              theme === 'dark' ? 'text-cyan-300' : 'text-blue-600'
            }`}
          >
            KidZone
          </span>
        </h1>
        <p
          className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-white/90' : 'text-gray-700'
          }`}
        >
          A safe and joyful learning platform for kids — where parents guide, and creators inspire.
        </p>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Parent Section */}
          <div
            className={`rounded-3xl p-8 md:p-10 shadow-lg transition-all duration-300 border ${
              theme === 'dark'
                ? 'bg-white/10 border-white/10 backdrop-blur-xl hover:shadow-cyan-400/30 hover:-translate-y-2'
                : 'bg-white border-gray-200 hover:shadow-xl hover:-translate-y-2'
            }`}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <span className="text-3xl">👨‍👩‍👧‍👦</span>
            </div>
            <h2
              className={`text-2xl font-bold mb-3 ${
                theme === 'dark' ? 'text-cyan-100' : 'text-blue-800'
              }`}
            >
              For Parents
            </h2>
            <p
              className={`text-base mb-7 ${
                theme === 'dark' ? 'text-white/80' : 'text-gray-700'
              }`}
            >
              Create a safe environment for your kids. Manage subscriptions and control what your children learn.
            </p>
            <div className="space-y-3">
              <Link
                to="/register?role=parent"
                className="block w-full bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-blue-900 py-3 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all"
              >
                Register as Parent
              </Link>
              <Link
                to="/login?role=parent"
                className={`block w-full border py-3 rounded-lg font-semibold transition-colors ${
                  theme === 'dark'
                    ? 'border-cyan-400 text-white hover:bg-white/10'
                    : 'border-blue-400 text-blue-700 hover:bg-blue-50'
                }`}
              >
                Login as Parent
              </Link>
            </div>
          </div>

          {/* Creator Section */}
          <div
            className={`rounded-3xl p-8 md:p-10 shadow-lg transition-all duration-300 border ${
              theme === 'dark'
                ? 'bg-white/10 border-white/10 backdrop-blur-xl hover:shadow-cyan-400/30 hover:-translate-y-2'
                : 'bg-white border-gray-200 hover:shadow-xl hover:-translate-y-2'
            }`}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <span className="text-3xl">🎬</span>
            </div>
            <h2
              className={`text-2xl font-bold mb-3 ${
                theme === 'dark' ? 'text-cyan-100' : 'text-blue-800'
              }`}
            >
              For Creators
            </h2>
            <p
              className={`text-base mb-7 ${
                theme === 'dark' ? 'text-white/80' : 'text-gray-700'
              }`}
            >
              Share inspiring educational content with young minds. Build your presence and help kids learn creatively.
            </p>
            <div className="space-y-3">
              <Link
                to="/register?role=creator"
                className="block w-full bg-gradient-to-r from-pink-400 to-yellow-300 hover:from-pink-300 hover:to-yellow-200 text-blue-900 py-3 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all"
              >
                Register as Creator
              </Link>
              <Link
                to="/login?role=creator"
                className={`block w-full border py-3 rounded-lg font-semibold transition-colors ${
                  theme === 'dark'
                    ? 'border-yellow-300 text-white hover:bg-white/10'
                    : 'border-yellow-400 text-blue-700 hover:bg-yellow-50'
                }`}
              >
                Login as Creator
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: '🔒',
              title: 'Safe Environment',
              desc: 'Parents have full control over what their kids can watch and learn.',
            },
            {
              icon: '🎓',
              title: 'Quality Content',
              desc: 'Curated videos from verified creators ensure educational value.',
            },
            {
              icon: '👶',
              title: 'Kid-Friendly',
              desc: 'Simple, colorful, and easy-to-navigate interface built for young learners.',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className={`text-center rounded-3xl p-8 hover:scale-105 transition-transform duration-300 shadow-lg ${
                theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md hover:shadow-cyan-400/20'
                  : 'bg-white border border-gray-200 hover:shadow-lg'
              }`}
            >
              <div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-cyan-100' : 'text-blue-800'
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`text-sm ${
                  theme === 'dark' ? 'text-white/80' : 'text-gray-700'
                }`}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`border-t text-center py-5 text-xs md:text-sm ${
          theme === 'dark'
            ? 'bg-blue-900/40 border-cyan-400/20 text-white/80'
            : 'bg-blue-50 border-gray-200 text-gray-600'
        }`}
      >
        <p>
          © {new Date().getFullYear()} <span className="font-semibold text-cyan-400">KidZone</span>. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default HomePage
