// routes/googleAuthRoutes.js
import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // redirect on failure
  }),
  (req, res) => {
    try {
      const user = req.user;

      // Generate JWT (like normal login)
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/home?token=${token}`);
    } catch (err) {
      console.error("Google OAuth callback error:", err);
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  }
);

export default router;
