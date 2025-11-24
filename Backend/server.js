// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";

dotenv.config();
const app = express();

// =============================
// 🔗 Connect to MongoDB
// =============================
connectDB()
  .then(() => console.log("🟢 MongoDB Connected Successfully"))
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  });

// =============================
// 🧩 Middleware
// =============================
app.use(express.json());
app.use(morgan("dev"));

// =============================
// 🌐 CORS Setup (Best Practice)
// =============================
const allowedOrigins = [
  "http://localhost:5173",
  "https://stock-management-orcin.vercel.app",
  "https://stock-management-1-v9hz.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`❌ CORS blocked for ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 🔁 Handle preflight requests
app.options("*", cors());

// =============================
// 🚩 API Routes
// =============================
app.get("/", (req, res) =>
  res.json({ message: "🚀 Welcome to Stock Management API" })
);

app.get("/health", (req, res) => res.status(200).send("OK ✓"));

app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);

// =============================
// ❌ 404 Handler
// =============================
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// =============================
// 🚨 Global Error Handler
// =============================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack || err);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Server Error" });
});

// =============================
// 🚀 Start Server
// =============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on PORT ${PORT} in ${process.env.NODE_ENV} mode 👍`)
);
