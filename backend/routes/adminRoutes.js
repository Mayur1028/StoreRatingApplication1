const express = require("express");
const {
  getDashboardStats,
  addUser,
  addStore,
  getUsers,
  getStores,
  getUserDetails,
} = require("../controllers/adminController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

router.get("/dashboard", getDashboardStats);
router.post("/users", addUser);
router.post("/stores", addStore);
router.get("/users", getUsers);
router.get("/stores", getStores);
router.get("/users/:id", getUserDetails);

module.exports = router;
