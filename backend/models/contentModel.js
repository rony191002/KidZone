//backend/models/contentModel.js

import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  category: { 
    type: String,
    required: true,
    enum: ["educational", "entertainment", "music", "art", "science", "math", "reading"]
  },
  type: {
    type: String,
    required: true,
    enum: ["video", "image", "interactive"]
  },
  mediaUrl: { 
    type: String, 
    required: true 
  },
  thumbnailUrl: { 
    type: String 
  },
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  // ENHANCED APPROVAL SYSTEM
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: ""
  },
  ageRange: {
    min: { type: Number, default: 3 },
    max: { type: Number, default: 12 }
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  likesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Content = mongoose.model("Content", contentSchema);
export { Content };