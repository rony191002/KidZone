//routes/creatorRoutes.js
import express from "express";
import { 
  uploadContent, 
  getSubscribers, 
  getCreatorContent
} from "../controllers/creatorController.js";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";
import { User } from "../models/userModel.js";
import { Content } from "../models/contentModel.js";

const router = express.Router();

// UPLOAD ROUTE - ADD THIS BACK
router.post("/upload", isAuth, uploadFile, uploadContent);

router.get("/subscribers", isAuth, getSubscribers);
router.get("/content", isAuth, getCreatorContent);

// Get all creators (protected)
router.get("/all", isAuth, async (req, res) => {
  try {
    const creators = await User.find({ role: "creator" })
      .select("username email bio profilePicture");
    res.status(200).json({ creators });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Debug route to check what's happening
router.get("/debug/:creatorId", async (req, res) => {
  try {
    console.log("=== DEBUG ROUTE ===");
    console.log("Requested creator ID:", req.params.creatorId);
    
    // Check if user exists
    const user = await User.findById(req.params.creatorId);
    console.log("User found:", user ? `${user.username} (role: ${user.role})` : 'NOT FOUND');
    
    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }
    
    if (user.role !== "creator") {
      return res.status(404).json({ 
        message: "User is not a creator", 
        actualRole: user.role,
        username: user.username 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: "Debug: Creator exists and is valid",
      creator: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Debug route error:", error);
    res.status(500).json({ 
      success: false,
      message: "Debug error", 
      error: error.message 
    });
  }
});

// PUBLIC creator profile route (NO authentication)
router.get("/profile/:creatorId", async (req, res) => {
  try {
    console.log("Profile route called for creator:", req.params.creatorId);
    
    const creator = await User.findById(req.params.creatorId);
    
    if (!creator) {
      console.log("Creator not found by ID");
      return res.status(404).json({ message: "Creator not found" });
    }
    
    if (creator.role !== "creator") {
      console.log("User found but not a creator. Role:", creator.role);
      return res.status(404).json({ message: "Creator not found" });
    }

    console.log("Creator found:", creator.username);

    // Get creator's content (approved only)
    const content = await Content.find({ 
      creator: req.params.creatorId,
      status: "approved"
    })
    .select("title description category type mediaUrl thumbnailUrl likesCount createdAt")
    .sort({ createdAt: -1 })
    .limit(20);

    // Get subscriber count
    const subscriberCount = await User.countDocuments({
      subscriptions: req.params.creatorId,
      role: "parent"
    });

    res.status(200).json({
      success: true,
      creator: {
        _id: creator._id,
        username: creator.username,
        email: creator.email,
        bio: creator.bio,
        profilePicture: creator.profilePicture,
        createdAt: creator.createdAt,
        subscriberCount,
        contentCount: content.length
      },
      content
    });
  } catch (error) {
    console.error("Get creator profile error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid creator ID format" });
    }
    
    res.status(500).json({ 
      message: "Server error while fetching creator profile",
      error: error.message 
    });
  }
});

// Public creators list (NO authentication)
router.get("/public/all", async (req, res) => {
  try {
    const creators = await User.find({ role: "creator" })
      .select("username email bio profilePicture _id");
    
    res.status(200).json({ 
      success: true,
      creators 
    });
  } catch (error) {
    console.error("Get public creators error:", error);
    res.status(500).json({ 
      message: "Server error while fetching creators",
      error: error.message 
    });
  }
});

export default router;