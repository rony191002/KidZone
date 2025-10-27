//backend/controllers/creatorController.js
import { Content } from "../models/contentModel.js";
import { User } from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";
import fs from 'fs';

// Upload Content (Video/Image) - UPDATED FOR ADMIN APPROVAL
export const uploadContent = async (req, res) => {
  try {
    console.log('Upload request received:', {
      file: req.file ? req.file.originalname : 'No file',
      body: req.body
    });

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, description, category, type } = req.body;

    if (!title || !category || !type) {
      // Clean up the uploaded file if validation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Title, category, and type are required" });
    }

    console.log('Uploading to Cloudinary from:', req.file.path);

    // Upload to Cloudinary from the saved file
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: type === "video" ? "video" : "image",
      folder: "kidzone-content"
    });

    console.log('Cloudinary upload successful:', uploadResult.secure_url);

    // For videos, generate thumbnail
    let thumbnailUrl = uploadResult.secure_url;
    if (type === "video") {
      const thumbnailPublicId = uploadResult.public_id.replace(/\.[^/.]+$/, "");
      thumbnailUrl = cloudinary.url(thumbnailPublicId, {
        resource_type: "video",
        format: "jpg",
        transformation: [
          { width: 300, height: 200, crop: "fill" }
        ]
      });
    }

    const newContent = new Content({
      title,
      description,
      category,
      type,
      mediaUrl: uploadResult.secure_url,
      thumbnailUrl,
      creator: req.user.id,
      status: "pending", // NEW: Content requires admin approval
      isApproved: false  // NEW: Must be approved by admin
    });

    await newContent.save();

    // Delete the temporary file from uploads folder
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log('Temporary file deleted:', req.file.path);
    }

    console.log('Content saved to database (pending approval):', newContent._id);

    res.status(201).json({ 
      message: "Content uploaded successfully and pending admin approval", 
      content: newContent 
    });
  } catch (error) {
    console.error("Upload error:", error);
    
    // Clean up the uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log('Cleaned up temporary file due to error');
    }
    
    res.status(500).json({ message: error.message });
  }
};

// Get Creator's Subscribers
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await User.find({ 
      subscriptions: req.user.id,
      role: "parent"
    }).select("username email");

    res.status(200).json({ subscribers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Creator's Content
export const getCreatorContent = async (req, res) => {
  try {
    const content = await Content.find({ creator: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};