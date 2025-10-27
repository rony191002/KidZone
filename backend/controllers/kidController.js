//backend/controllers/kidController.js
import { Content } from "../models/contentModel.js";
import { User } from "../models/userModel.js";

// Get Content for Kids (Based on Parent's Subscriptions) - UPDATED FOR ADMIN APPROVAL SYSTEM
export const getContentForKids = async (req, res) => {
  try {
    if (req.user.mode !== "kid") {
      return res.status(403).json({ message: "Access denied. Switch to kid mode first." });
    }

    let subscribedCreators = [];

    // Get subscribed creators based on user type
    if (req.user.role === "kid") {
      // Kid user - get parent's subscriptions
      const parent = await User.findById(req.user.parent);
      if (parent) {
        subscribedCreators = parent.subscriptions || [];
      }
    } else {
      // Parent in kid mode - use their own subscriptions
      subscribedCreators = req.user.subscriptions || [];
    }

    // If no subscriptions, return empty array
    if (subscribedCreators.length === 0) {
      return res.status(200).json({ content: [] });
    }

    // ONLY SHOW APPROVED CONTENT - UPDATED FOR ADMIN APPROVAL
    const content = await Content.find({ 
      creator: { $in: subscribedCreators },
      status: "approved", // NEW: Only show content with "approved" status
      isApproved: true    // Keep for backward compatibility
    })
    .populate("creator", "username profilePicture")
    .sort({ createdAt: -1 });

    // Add isLiked field to each content item based on current user's likes
    const contentWithLikeStatus = content.map(item => {
      const isLiked = item.likes.includes(req.user.id);
      return {
        ...item.toObject(),
        isLiked
      };
    });

    res.status(200).json({ 
      content: contentWithLikeStatus,
      userLikes: content.filter(item => item.likes.includes(req.user.id)).map(item => item._id)
    });
  } catch (error) {
    console.error("Get kid content error:", error);
    res.status(500).json({ message: "Server error while fetching content" });
  }
};