import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { Content } from "../models/contentModel.js";

const router = express.Router();

// Like content - FIXED VERSION
router.post("/:id/like", isAuth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Check if user already liked
    const alreadyLiked = content.likes.includes(req.user.id);
    
    if (alreadyLiked) {
      // Return success instead of error for idempotent behavior
      return res.status(200).json({ 
        message: "Content already liked",
        likesCount: content.likesCount 
      });
    }

    // Add like
    content.likes.push(req.user.id);
    content.likesCount = content.likes.length;
    await content.save();

    res.status(200).json({ 
      message: "Content liked successfully",
      likesCount: content.likesCount 
    });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Server error while liking content" });
  }
});

// Unlike content - FIXED VERSION
router.delete("/:id/like", isAuth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Check if user liked
    const likeIndex = content.likes.indexOf(req.user.id);
    
    if (likeIndex === -1) {
      // Return success instead of error for idempotent behavior
      return res.status(200).json({ 
        message: "Content not liked",
        likesCount: content.likesCount 
      });
    }

    // Remove like
    content.likes.splice(likeIndex, 1);
    content.likesCount = content.likes.length;
    await content.save();

    res.status(200).json({ 
      message: "Content unliked successfully",
      likesCount: content.likesCount 
    });
  } catch (error) {
    console.error("Unlike error:", error);
    res.status(500).json({ message: "Server error while unliking content" });
  }
});

export default router;