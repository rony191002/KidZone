import { Content } from "../models/contentModel.js";
import { User } from "../models/userModel.js";

// Get all pending content for review
export const getPendingContent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin role required." });
    }

    const pendingContent = await Content.find({ status: "pending" })
      .populate("creator", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({ content: pendingContent });
  } catch (error) {
    console.error("Get pending content error:", error);
    res.status(500).json({ message: "Server error while fetching pending content" });
  }
};

// Approve content
export const approveContent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin role required." });
    }

    const { contentId } = req.params;

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    content.status = "approved";
    content.isApproved = true;
    content.reviewedBy = req.user.id;
    content.reviewedAt = new Date();
    
    await content.save();

    res.status(200).json({ 
      message: "Content approved successfully",
      content 
    });
  } catch (error) {
    console.error("Approve content error:", error);
    res.status(500).json({ message: "Server error while approving content" });
  }
};

// Reject content
export const rejectContent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin role required." });
    }

    const { contentId } = req.params;
    const { reason } = req.body;

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    content.status = "rejected";
    content.isApproved = false;
    content.reviewedBy = req.user.id;
    content.reviewedAt = new Date();
    content.rejectionReason = reason || "Content does not meet our guidelines";
    
    await content.save();

    res.status(200).json({ 
      message: "Content rejected successfully",
      content 
    });
  } catch (error) {
    console.error("Reject content error:", error);
    res.status(500).json({ message: "Server error while rejecting content" });
  }
};

// Get all content with filters (for admin dashboard)
export const getAllContent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin role required." });
    }

    const { status } = req.query;
    let filter = {};
    
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }

    const content = await Content.find(filter)
      .populate("creator", "username email")
      .populate("reviewedBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({ content });
  } catch (error) {
    console.error("Get all content error:", error);
    res.status(500).json({ message: "Server error while fetching content" });
  }
};

// Get admin dashboard stats
export const getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin role required." });
    }

    const [
      totalContent,
      pendingContent,
      approvedContent,
      rejectedContent,
      totalCreators,
      totalParents
    ] = await Promise.all([
      Content.countDocuments(),
      Content.countDocuments({ status: "pending" }),
      Content.countDocuments({ status: "approved" }),
      Content.countDocuments({ status: "rejected" }),
      User.countDocuments({ role: "creator" }),
      User.countDocuments({ role: "parent" })
    ]);

    res.status(200).json({
      stats: {
        totalContent,
        pendingContent,
        approvedContent,
        rejectedContent,
        totalCreators,
        totalParents
      }
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({ message: "Server error while fetching admin stats" });
  }
};