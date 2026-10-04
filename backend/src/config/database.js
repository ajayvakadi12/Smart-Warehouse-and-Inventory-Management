const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MongoDB Connection Error: MONGO_URI environment variable is missing!");
    console.error("👉 Please set MONGO_URI in your Render Dashboard (Environment tab).");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error");
    console.error(err.message || err);
    console.error("👉 If using MongoDB Atlas, make sure you allowed access from anywhere (0.0.0.0/0) in Network Access settings.");
    process.exit(1);
  }
};

module.exports = connectDB;