//backend/middlewares/isAuth.js
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decodedData.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    
    res.status(500).json({ message: "Authentication failed" });
  }
};