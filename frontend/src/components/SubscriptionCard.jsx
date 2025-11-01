//src/components/SubscriptionCard.jsx
import React from 'react'

const SubscriptionCard = ({ creator, onUnsubscribe }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center space-x-4 mb-3 sm:mb-0">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-lg">👨‍🏫</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{creator.username}</h3>
          <p className="text-gray-600 text-sm break-words">{creator.email}</p>
        </div>
      </div>

      <button
        onClick={() => onUnsubscribe(creator._id)}
        className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 w-full sm:w-auto transition-all"
      >
        Unsubscribe
      </button>
    </div>
  )
}

export default SubscriptionCard
