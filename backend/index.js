// // //index.js
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import { connectDb } from "./database/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import creatorRoutes from "./routes/creatorRoutes.js";
// import parentRoutes from "./routes/parentRoutes.js";
// import kidRoutes from "./routes/kidRoutes.js";
// import contentRoutes from "./routes/contentRoutes.js";

// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 7000;

// // Connect to Database
// connectDb();

// // CORS configuration - allow both HTTP and HTTPS
// const allowedOrigins = [
//   "http://localhost:5174",
//   "https://localhost:5174",
//   "http://localhost:5173",
//   "https://localhost:5173"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"]
// }));

// // Handle preflight requests
// app.options('*', cors());

// // Middleware
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(cookieParser());

// // Test route
// app.get("/api/health", (req, res) => {
//   res.status(200).json({ 
//     message: "KidZone Backend is running successfully!", 
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// // FIXED: Correct route order - specific routes before generic ones
// app.use("/api/auth", authRoutes);
// app.use("/api/creators", creatorRoutes); // This should come BEFORE content routes
// app.use("/api/parents", parentRoutes);
// app.use("/api/kids", kidRoutes);
// app.use("/api/content", contentRoutes); // MOVED THIS TO LAST

// // 404 handler for undefined routes
// app.use("*", (req, res) => {
//   res.status(404).json({ 
//     message: "Route not found", 
//     path: req.originalUrl,
//     availableEndpoints: [
//       "/api/health",
//       "/api/auth/register",
//       "/api/auth/login", 
//       "/api/auth/logout",
//       "/api/auth/me",
//       "/api/creators/upload",
//       "/api/creators/subscribers",
//       "/api/creators/content",
//       "/api/creators/all",
//       "/api/creators/profile/:id", // Add this to the list
//       "/api/parents/subscribe",
//       "/api/parents/unsubscribe", 
//       "/api/parents/switch-to-kid-mode",
//       "/api/parents/switch-to-parent-mode",
//       "/api/parents/subscriptions",
//       "/api/kids/content",
//       "/api/content/:id/like" // From content routes
//     ]
//   });
// });

// // Global error handler
// app.use((error, req, res, next) => {
//   console.error("Global error handler:", error);
//   res.status(500).json({ 
//     message: "Internal server error",
//     ...(process.env.NODE_ENV === 'development' && { error: error.message })
//   });
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
//   console.log(`🔗 Allowed origins: ${allowedOrigins.join(', ')}`);
//   console.log(`✅ CORS configured for frontend development`);
// });

//-------------------------------------------------------------------------

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import creatorRoutes from "./routes/creatorRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import kidRoutes from "./routes/kidRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

// Connect to Database
connectDb();

// CORS configuration - allow both HTTP and HTTPS
const allowedOrigins = [
  "http://localhost:5174",
  "https://localhost:5174",
  "http://localhost:5173",
  "https://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"]
}));

app.options('*', cors());

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Test route
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    message: "KidZone Backend is running successfully!", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// FIXED ROUTE ORDER: More specific routes first
app.use("/api/auth", authRoutes);
app.use("/api/creators", creatorRoutes);  // This should come BEFORE admin
app.use("/api/parents", parentRoutes);
app.use("/api/kids", kidRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/admin", adminRoutes);       // This should come LAST (most generic)

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({ 
    message: "Route not found", 
    path: req.originalUrl,
    availableEndpoints: [
      "/api/health",
      "/api/auth/register",
      "/api/auth/login", 
      "/api/auth/logout",
      "/api/auth/me",
      "/api/creators/upload",
      "/api/creators/subscribers",
      "/api/creators/content",
      "/api/creators/all",
      "/api/creators/profile/:id",
      "/api/parents/subscribe",
      "/api/parents/unsubscribe", 
      "/api/parents/switch-to-kid-mode",
      "/api/parents/switch-to-parent-mode",
      "/api/parents/subscriptions",
      "/api/kids/content",
      "/api/admin/content/pending",
      "/api/admin/content/all",
      "/api/admin/stats"
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({ 
    message: "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`✅ CORS configured for frontend development`);
  console.log(`🔐 Admin routes: /api/admin/*`);
});