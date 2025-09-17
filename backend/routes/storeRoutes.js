const express = require("express");
const {
  getStoresForUser,
  submitRating,
} = require("../controllers/storeController");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/", getStoresForUser);
router.post("/rating", submitRating);

module.exports = router;
