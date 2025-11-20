import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import stockRoutes from "./routes/stockRoutes.js"

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => res.send("API Running..."))

app.use("/api/auth", authRoutes)
app.use("/api/stocks", stockRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
