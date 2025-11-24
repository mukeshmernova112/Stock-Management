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

// Connect MongoDB
connectDB()
  .then(() => console.log("🟢 MongoDB Connected"))
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  });


  // Middleware
app.use(express.json());
app.use(morgan("dev"));



// Allowed origins
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "stock-management-orcin.vercel.app", // replace with actual deployed frontend (Netlify/Vercel)
  "https://stock-management-1-v9hz.onrender.com", // Render backend
];

// CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`❌ CORS blocked: ${origin}`), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],    // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => res.json({ message: "Welcome to Stock Management API 🚀" }));
app.get("/health", (req, res) => res.status(200).send("OK"));

app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);

// 404 Handler
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err.stack || err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT} 👍`));
