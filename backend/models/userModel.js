//backend/models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "creator", "parent", "kid"], // ADDED "admin" role
    required: true
  },
  pin: {
    type: String,
    default: null
  },
  mode: {
    type: String,
    enum: ["parent", "kid"],
    default: "parent"
  },
  // For parents: creators they subscribe to
  subscriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  // For kids: link to parent account
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  // Profile information
  profilePicture: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  // For creators: content they've created
  content: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content"
  }]
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
export { User };