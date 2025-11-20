import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @desc    Register a new user (Admin or regular user)
 * @route   POST /api/auth/register
 * @access  Public (ideally only admins create users)
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, branch } = req.body;

    // Validate input
    if (!name || !email || !password || !role || !branch) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,   // 'admin' or 'user'
      branch, // must match enum in User model
    });

    // Build response object explicitly including role
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,       // <--- include role
      branch: newUser.branch,   // <--- include branch
      __v: newUser.__v
    };

    return res.status(201).json({
      msg: "User registered successfully",
      user: userResponse,
    });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ msg: "Server error during registration" });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(400).json({ msg: "Invalid password" });

    // Generate JWT token including role and branch
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        branch: user.branch,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // token valid for 1 day
    );

    // Build response object explicitly including role
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,       // <--- include role
      branch: user.branch,   // <--- include branch
      __v: user.__v
    };

    return res.status(200).json({
      msg: "Login successful",
      token,
      user: userResponse,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ msg: "Server error during login" });
  }
};
