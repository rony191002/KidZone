//backend/models/subscriptionModel.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // Subscription status
  isActive: {
    type: Boolean,
    default: true
  },
  // Kid-specific settings
  allowedAgeRange: {
    min: { type: Number, default: 3 },
    max: { type: Number, default: 12 }
  },
  // Auto-approve content from this creator
  autoApprove: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure one subscription per parent-creator pair
subscriptionSchema.index({ parent: 1, creator: 1 }, { unique: true });

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export { Subscription };