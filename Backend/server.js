import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";

dotenv.config();
const app = express();

// 📌 MongoDB Connection
(async () => {
  try {
    await connectDB();
    console.log("🟢 MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
})();

// 📌 Middleware
app.use(express.json());
app.use(morgan("dev"));

// 📌 CORS Setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://stock-management-orcin.vercel.app", // Vercel frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 🛑 ❌ REMOVE THIS LINE (crash ஆகும் காரணம் இது)
// app.options("/*", cors());

// ✔ Correct (Express 5+ supports just "*")
app.options("*", cors());

// 📌 Routes
app.get("/", (req, res) =>
  res.json({ message: "🚀 Welcome to Stock Management API" })
);
app.get("/health", (req, res) => res.status(200).send("OK"));

app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);

// 📌 404 Handler
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// 📌 Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on PORT ${PORT}`)
);
