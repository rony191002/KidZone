//backend/routes/authRoutes.js
import express from "express";
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser 
} from "../controllers/authController.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", isAuth, getCurrentUser);
router.get("/test", (req, res) => {
  res.json({ message: "Backend works fine!" });
});

export default router;