import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB()
  .then(() => console.log("🟢 MongoDB Connected"))
  .catch((error) => {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1); // Stop server if DB fails
  });

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Allow frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev")); // Request logging

// Test API Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Stock Management API 🚀" });
});

// Health Check (Render needs this)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🚨 Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
