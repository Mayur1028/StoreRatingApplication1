const express = require("express");
const { getOwnerDashboard } = require("../controllers/storeOwnerController");
const { authenticateToken, requireStoreOwner } = require("../middleware/auth");
const router = express.Router();

// Store owner routes
router.use(authenticateToken, requireStoreOwner);

router.get("/dashboard", getOwnerDashboard);

module.exports = router;
