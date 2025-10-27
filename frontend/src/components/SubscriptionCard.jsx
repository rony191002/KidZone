//src/components/SubscriptionCard.jsx
import React from 'react'

const SubscriptionCard = ({ creator, onUnsubscribe }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-lg">👨‍🏫</span>
        </div>
        <div>
          <h3 className="font-semibold">{creator.username}</h3>
          <p className="text-gray-600 text-sm">{creator.email}</p>
        </div>
      </div>
      <button
        onClick={() => onUnsubscribe(creator._id)}
        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
      >
        Unsubscribe
      </button>
    </div>
  )
}

export default SubscriptionCard