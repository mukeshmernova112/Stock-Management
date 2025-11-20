import mongoose from "mongoose"

const stockSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: {
    type: String,
    enum: ["Chennai", "Coimbatore", "Trichy", "Madurai", "Service Station"],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Stock", stockSchema)
