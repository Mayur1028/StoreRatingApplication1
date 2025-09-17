const jwt = require("jsonwebtoken");

// Middleware that will verify my JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user; 
    next();
  });
};

// Middleware that will check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Middleware that will check if user is store owner
const requireStoreOwner = (req, res, next) => {
  if (req.user.role !== "store_owner") {
    return res.status(403).json({ error: "Store owner access required" });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireStoreOwner,
};
