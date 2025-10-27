// import React, { useState } from 'react'
// import { useAuth } from '../context/AuthContext'
// import { useNavigate } from 'react-router-dom'

// const KidModePinModal = ({ isOpen, onClose, mode = 'enter' }) => {
//   const [pin, setPin] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const { enterKidMode, exitKidMode } = useAuth()
//   const navigate = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
    
//     // Validate PIN length
//     if (pin.length !== 4) {
//       setError('PIN must be exactly 4 digits')
//       return
//     }

//     // Validate PIN contains only numbers
//     if (!/^\d+$/.test(pin)) {
//       setError('PIN must contain only numbers')
//       return
//     }

//     setLoading(true)

//     try {
//       if (mode === 'enter') {
//         await enterKidMode(pin)
//         // Use navigate instead of window.location.href
//         navigate('/kid')
//       } else {
//         await exitKidMode(pin)
//         // Use navigate instead of window.location.href  
//         navigate('/parent')
//       }
      
//       // Close modal and reset form on success
//       setPin('')
//       onClose()
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid PIN. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleClose = () => {
//     setPin('')
//     setError('')
//     onClose()
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-96">
//         <h2 className="text-2xl font-bold mb-4">
//           {mode === 'enter' ? 'Enter Kid Mode' : 'Exit Kid Mode'}
//         </h2>
//         <p className="text-gray-600 mb-4 text-sm">
//           {mode === 'enter' 
//             ? 'Enter your PIN to access kid-friendly content' 
//             : 'Enter your PIN to return to parent mode'
//           }
//         </p>
        
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Enter PIN
//             </label>
//             <input
//               type="password"
//               value={pin}
//               onChange={(e) => {
//                 setPin(e.target.value)
//                 setError('') // Clear error when user types
//               }}
//               placeholder="Enter 4-digit PIN"
//               maxLength="4"
//               pattern="[0-9]*"
//               inputMode="numeric"
//               className="custom-input"
//               required
//               disabled={loading}
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Enter your 4-digit PIN
//             </p>
//           </div>
          
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
//               {error}
//             </div>
//           )}
          
//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading || pin.length !== 4}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
//             >
//               {loading ? 'Verifying...' : 'Confirm'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default KidModePinModal

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const KidModePinModal = ({ isOpen, onClose, mode = 'enter' }) => {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const { enterKidMode, exitKidMode } = useAuth()
  const navigate = useNavigate()
  const inputRef = useRef(null)

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setPin('')
      setError('')
      setLoading(false)
      
      // Force clear any browser autofill
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.value = ''
          inputRef.current.setAttribute('autocomplete', 'off')
          inputRef.current.setAttribute('autocorrect', 'off')
          inputRef.current.setAttribute('autocapitalize', 'off')
          inputRef.current.setAttribute('spellcheck', 'false')
        }
      }, 100)
    }
  }, [isOpen, mode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate PIN
    if (pin.length !== 4) {
      setError('PIN must be exactly 4 digits')
      return
    }

    if (!/^\d+$/.test(pin)) {
      setError('PIN must contain only numbers')
      return
    }

    // Security: Add delay after multiple failed attempts
    if (attempts >= 2) {
      setError('Too many failed attempts. Please wait 10 seconds.')
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setError('')
        setAttempts(0)
      }, 10000)
      return
    }

    setLoading(true)

    try {
      if (mode === 'enter') {
        await enterKidMode(pin)
        setAttempts(0)
        navigate('/kid')
      } else {
        await exitKidMode(pin)
        setAttempts(0)
        navigate('/parent')
      }
      
      setPin('')
      onClose()
    } catch (err) {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      
      if (newAttempts >= 3) {
        setError('Too many incorrect PIN attempts. Please contact the parent.')
      } else {
        setError(err.response?.data?.message || `Invalid PIN. ${3 - newAttempts} attempts remaining.`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setPin('')
    setError('')
    setAttempts(0)
    onClose()
  }

  const handlePinChange = (e) => {
    const value = e.target.value
    // Only allow numbers and limit to 4 digits
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value)
      setError('') // Clear error when user types
    }
  }

  // Generate random attributes to confuse autofill
  const getRandomAttributes = () => {
    const names = ['verification_code', 'access_key', 'security_pin', 'lock_code', 'parent_code']
    const types = ['text', 'password', 'tel']
    
    return {
      name: names[Math.floor(Math.random() * names.length)],
      type: types[Math.floor(Math.random() * types.length)]
    }
  }

  const randomAttrs = getRandomAttributes()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 mx-4 shadow-2xl">
        {/* Security Header */}
        <div className="text-center mb-2">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'enter' ? 'Enter Kid Mode' : 'Exit Kid Mode'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {mode === 'enter' 
              ? 'Parent PIN required to access kid mode' 
              : 'Parent PIN required to exit'
            }
          </p>
        </div>

        {/* Security Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-start">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <p className="text-xs text-yellow-800">
              <strong>Security Notice:</strong> Only parents should know this PIN
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
              Enter Parent PIN
            </label>
            <input
              ref={inputRef}
              type={randomAttrs.type}
              name={randomAttrs.name}
              value={pin}
              onChange={handlePinChange}
              placeholder="••••"
              maxLength="4"
              pattern="[0-9]*"
              inputMode="numeric"
              className="w-full px-4 py-3 text-2xl text-center tracking-widest font-mono bg-gray-50 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors"
              required
              disabled={loading}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-lpignore="true"
              data-form-type="other"
              data-1p-ignore="true"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              4-digit parent PIN required
            </p>
          </div>
          
          {error && (
            <div className={`p-3 rounded-lg text-sm ${
              error.includes('Too many') 
                ? 'bg-red-100 border border-red-300 text-red-700' 
                : 'bg-orange-100 border border-orange-300 text-orange-700'
            }`}>
              <div className="flex items-center">
                <span className="mr-2">
                  {error.includes('Too many') ? '🔐' : '⚠️'}
                </span>
                {error}
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || pin.length !== 4}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-semibold shadow-sm"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Verifying...
                </span>
              ) : (
                'Verify PIN'
              )}
            </button>
          </div>
        </form>

        {/* Fake hidden inputs to confuse password managers */}
        <div style={{ display: 'none' }}>
          <input type="password" name="password" autoComplete="new-password" />
          <input type="text" name="username" autoComplete="username" />
          <input type="password" name="current-password" autoComplete="current-password" />
        </div>
      </div>
    </div>
  )
}

export default KidModePinModal