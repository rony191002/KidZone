import express from "express";
import { 
  getPendingContent,
  approveContent,
  rejectContent,
  getAllContent,
  getAdminStats
} from "../controllers/adminController.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// Admin routes - all require admin role
router.get("/content/pending", isAuth, getPendingContent);
router.get("/content/all", isAuth, getAllContent);
router.get("/stats", isAuth, getAdminStats);
router.patch("/content/:contentId/approve", isAuth, approveContent);
router.patch("/content/:contentId/reject", isAuth, rejectContent);

export default router;