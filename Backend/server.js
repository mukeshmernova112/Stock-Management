// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js"; // Google OAuth

dotenv.config();
const app = express();

// -------------------------
// MongoDB Connection
// -------------------------
(async () => {
  try {
    await connectDB();
    console.log("🟢 MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
})();

// -------------------------
// Middlewares
// -------------------------
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
});
app.use(limiter);

// -------------------------
// CORS configuration
// -------------------------
const allowedOrigins = new Set([
  "http://localhost:5173",                    // local frontend
  "https://stock-management-orcin.vercel.app", // deployed frontend
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman / server-to-server
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error(`CORS policy: Blocked origin ${origin}`), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// -------------------------
// Basic routes
// -------------------------
app.get("/", (req, res) => res.json({ message: "🚀 Welcome to Stock Management API" }));
app.get("/health", (req, res) => res.status(200).send("OK"));

// -------------------------
// API Routes
// -------------------------
app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/auth", googleAuthRoutes); // Google OAuth routes

// -------------------------
// 404 handler
// -------------------------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// -------------------------
// Global error handler
// -------------------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err && err.stack ? err.stack : err);
  const status = err && err.status ? err.status : 500;
  res.status(status).json({
    success: false,
    message: err && err.message ? err.message : "Internal Server Error",
  });
});

// -------------------------
// Start Server
// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Backend running on PORT ${PORT} (NODE_ENV=${process.env.NODE_ENV || "development"})`
  );
});
