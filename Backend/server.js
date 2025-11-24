import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";

dotenv.config();
const app = express();

// MongoDB Connection
connectDB()
  .then(() => console.log("🟢 MongoDB Connected"))
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  });

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// CORS Setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://stock-management-orcin.vercel.app", // 🟢 Frontend Vercel URL
];

// 🔥 FINAL CORS FIX
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 🔁 Preflight request (very important)
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

// Routes
app.get("/", (req, res) =>
  res.json({ message: "🚀 Welcome to Stock Management API" })
);
app.get("/health", (req, res) => res.status(200).send("OK"));

app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);

// 404 Handler
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack || err);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on PORT ${PORT} (${process.env.NODE_ENV})`)
);
