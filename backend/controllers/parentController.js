//backend/controllers/parentController.js

import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";

// Subscribe to Content Creator
export const subscribeCreator = async (req, res) => {
  try {
    const { creatorId } = req.body;

    if (!creatorId) {
      return res.status(400).json({ message: "Creator ID is required" });
    }

    const creator = await User.findById(creatorId);

    if (!creator || creator.role !== "creator") {
      return res.status(404).json({ message: "Creator not found" });
    }

    // Check if already subscribed
    if (req.user.subscriptions.includes(creatorId)) {
      return res.status(400).json({ message: "Already subscribed to this creator" });
    }

    // Subscribe parent to creator
    req.user.subscriptions.push(creatorId);
    await req.user.save();

    res.status(200).json({ 
      message: "Subscribed successfully", 
      subscriptions: req.user.subscriptions 
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({ message: "Server error during subscription" });
  }
};

// Unsubscribe from Creator
export const unsubscribeCreator = async (req, res) => {
  try {
    const { creatorId } = req.body;

    req.user.subscriptions = req.user.subscriptions.filter(
      sub => sub.toString() !== creatorId
    );
    
    await req.user.save();

    res.status(200).json({ 
      message: "Unsubscribed successfully", 
      subscriptions: req.user.subscriptions 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Switch to Kid Mode
export const switchToKidMode = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ message: "PIN is required" });
    }

    // Check if PIN matches
    const isPinValid = await bcrypt.compare(pin, req.user.pin);
    if (!isPinValid) {
      return res.status(400).json({ message: "Invalid PIN" });
    }

    // Set user mode to "kid"
    req.user.mode = "kid";
    await req.user.save();

    res.status(200).json({ 
      message: "Switched to Kid Mode",
      mode: "kid"
    });
  } catch (error) {
    console.error("Switch to kid mode error:", error);
    res.status(500).json({ message: "Server error while switching mode" });
  }
};

// Switch to Parent Mode
export const switchToParentMode = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ message: "PIN is required" });
    }

    // Check if PIN matches
    const isPinValid = await bcrypt.compare(pin, req.user.pin);
    if (!isPinValid) {
      return res.status(400).json({ message: "Invalid PIN" });
    }

    // Set user mode to "parent"
    req.user.mode = "parent";
    await req.user.save();

    res.status(200).json({ 
      message: "Switched to Parent Mode",
      mode: "parent"
    });
  } catch (error) {
    console.error("Switch to parent mode error:", error);
    res.status(500).json({ message: "Server error while switching mode" });
  }
};

// Get parent's subscriptions
export const getSubscriptions = async (req, res) => {
  try {
    const parent = await User.findById(req.user.id)
      .populate("subscriptions", "username email profilePicture bio");

    res.status(200).json({ subscriptions: parent.subscriptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};