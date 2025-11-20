import jwt from "jsonwebtoken";

/**
 * Middleware: Verify JWT token
 * Checks the Authorization header for a valid token and attaches user info to req.user
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "Access denied: No token provided" });
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ msg: "Invalid token format. Use 'Bearer <token>'" });
    }

    const token = tokenParts[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ msg: "Invalid or expired token" });

      // Attach user info to req.user
      req.user = {
        id: decoded.id,
        role: decoded.role,
        branch: decoded.branch,
        email: decoded.email,
      };

      next();
    });
  } catch (err) {
    console.error("verifyToken error:", err);
    return res.status(500).json({ msg: "Server error during token verification" });
  }
};

/**
 * Middleware: Only admin users
 * Checks if the logged-in user has role: 'admin'
 */
export const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized: User info missing" }); 
    if (req.user.role !== "admin" ) {
        return res.status(403).json({ msg: "Access denied: Admins only" });
    }
    next();
  } catch (err) {
    console.error("verifyAdmin error:", err);
    return res.status(500).json({ msg: "Server error during admin verification" });
  } 
};


/**
 * Middleware: Admin or same branch
 * Admin can access any stock
 * Normal users can access only stocks in their branch
 */
export const verifyAdminOrSameBranch = (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized: User info missing" });

    // If admin, allow
    if (req.user.role === "admin") return next();

    // If normal user, check branch
    // req.body.location for POST/PUT requests
    // req.params.id or req.body.location may be used depending on your controller
    if (req.body.location && req.user.branch === req.body.location) {
      return next();
    }

    return res.status(403).json({ msg: "Only admins or users from the same branch can perform this action" });
  } catch (err) {
    console.error("verifyAdminOrSameBranch error:", err);
    return res.status(500).json({ msg: "Server error during branch verification" });
  }
};
