// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";

dotenv.config();
const app = express();

// --- DB connect (async)
(async () => {
  try {
    await connectDB();
    console.log("🟢 MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
})();

// --- Basic middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet()); // security headers

// --- Rate limiter (basic)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
});
app.use(limiter);

// --- CORS configuration (no wildcard routes)
const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://stock-management-orcin.vercel.app",
  // add other allowed origins here
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests like Postman (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.has(origin)) return callback(null, true);

      // reject other origins
      return callback(new Error(`CORS policy: Blocked origin ${origin}`), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false, // let cors() send the response
    optionsSuccessStatus: 204,
  })
);

// NOTE: Do NOT use app.options('*' or '/*', ...) or app.use('*', ...) — these trigger path-to-regexp errors.
// The cors() middleware above handles OPTIONS preflight automatically.

// --- Routes
app.get("/", (req, res) => res.json({ message: "🚀 Welcome to Stock Management API" }));
app.get("/health", (req, res) => res.status(200).send("OK"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);

// --- 404 handler (catch all)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// --- Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err && err.stack ? err.stack : err);
  const status = err && err.status ? err.status : 500;
  res.status(status).json({
    success: false,
    message: err && err.message ? err.message : "Internal Server Error",
  });
});

// --- Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on PORT ${PORT} (NODE_ENV=${process.env.NODE_ENV || "development"})`);
});
