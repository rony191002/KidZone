//backend/database/db.js

import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "KidZoneDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.db.databaseName}`);
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};
