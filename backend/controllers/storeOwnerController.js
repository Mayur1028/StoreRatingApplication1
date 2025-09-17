const pool = require("../config/database");

// Get store owner's dashboard data
const getOwnerDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get the store owned by this user
    const [stores] = await pool.query(
      "SELECT id, name FROM stores WHERE owner_id = ?",
      [userId]
    );

    if (stores.length === 0) {
      return res.status(404).json({ error: "No store found for this owner" });
    }

    const storeId = stores[0].id;
    const storeName = stores[0].name;

    // Get average rating
    const [avgRating] = await pool.query(
      "SELECT ROUND(AVG(rating), 2) as averageRating FROM ratings WHERE store_id = ?",
      [storeId]
    );

    // Get users who rated this store
    const [ratingUsers] = await pool.query(
      `
      SELECT 
        u.id, u.name, u.email, 
        r.rating, r.created_at
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC
    `,
      [storeId]
    );

    res.json({
      store: {
        id: storeId,
        name: storeName,
      },
      averageRating: avgRating[0].averageRating || 0,
      ratingUsers: ratingUsers,
    });
  } catch (error) {
    console.error("Owner dashboard error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getOwnerDashboard,
};
