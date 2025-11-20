import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
    enum: ["Chennai", "Coimbatore", "Trichy", "Madurai"],
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"], // admin or regular user
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
