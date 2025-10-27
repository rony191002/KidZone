//backend/controllers/authController.js
import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, pin } = req.body;
    
    // Validation
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = pin ? await bcrypt.hash(pin, 10) : null;

    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      role, 
      pin: hashedPin 
    });

    await newUser.save();

    generateToken(newUser._id, res);
    
    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Use .select("+password") to include the password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    generateToken(user._id, res);
    
    res.status(200).json({ 
      message: "Logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        mode: user.mode
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  try {
    res.cookie("token", "", { 
      expires: new Date(0), 
      httpOnly: true, 
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};