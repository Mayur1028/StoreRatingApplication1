const pool = require("../config/database");

// Get all stores for normal users with their ratings
const getStoresForUser = async (req, res) => {
  try {
    const { name, address, sortBy = "name", sortOrder = "ASC" } = req.query;
    const userId = req.user.userId;

    let query = `
      SELECT 
        s.id, s.name, s.address,
        ROUND(AVG(r.rating), 2) as overallRating,
        ur.rating as userRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ?
      WHERE 1=1
    `;
    const params = [userId];

    // Apply filters
    if (name) {
      query += " AND s.name LIKE ?";
      params.push(`%${name}%`);
    }
    if (address) {
      query += " AND s.address LIKE ?";
      params.push(`%${address}%`);
    }

    query += " GROUP BY s.id, s.name, s.address, ur.rating";

    // Add sorting
    const validSortFields = ["name", "address", "overallRating"];
    const validSortOrders = ["ASC", "DESC"];

    if (
      validSortFields.includes(sortBy) &&
      validSortOrders.includes(sortOrder.toUpperCase())
    ) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    }

    const [stores] = await pool.query(query, params);
    res.json(stores);
  } catch (error) {
    console.error("Get stores error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Submit or update rating
const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.userId;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if store exists
    const [stores] = await pool.query("SELECT id FROM stores WHERE id = ?", [
      storeId,
    ]);
    if (stores.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Check if user already rated this store
    const [existingRating] = await pool.query(
      "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );

    if (existingRating.length > 0) {
      // Update existing rating
      await pool.query(
        "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
        [rating, userId, storeId]
      );
      res.json({ message: "Rating updated successfully" });
    } else {
      // Insert new rating
      await pool.query(
        "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
        [userId, storeId, rating]
      );
      res.json({ message: "Rating submitted successfully" });
    }
  } catch (error) {
    console.error("Submit rating error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getStoresForUser,
  submitRating,
};

