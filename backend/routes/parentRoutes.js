//backend/routes/parentRoutes.js

import express from "express";
import { 
  subscribeCreator, 
  unsubscribeCreator, 
  switchToKidMode, 
  switchToParentMode,
  getSubscriptions 
} from "../controllers/parentController.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/subscribe", isAuth, subscribeCreator);
router.post("/unsubscribe", isAuth, unsubscribeCreator);
router.post("/switch-to-kid-mode", isAuth, switchToKidMode);
router.post("/switch-to-parent-mode", isAuth, switchToParentMode);
router.get("/subscriptions", isAuth, getSubscriptions);

export default router;