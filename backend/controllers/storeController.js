const { User, Store, Rating, sequelize } = require("../models");

// Getting all stores for normal users with their ratings
const getStoresForUser = async (req, res) => {
  try {
    const { name, address, sortBy = "name", sortOrder = "ASC" } = req.query;
    const userId = req.user.id;

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

    // Sorting
    const validSortFields = ["name", "address", "overallRating"];
    const validSortOrders = ["ASC", "DESC"];

    if (
      validSortFields.includes(sortBy) &&
      validSortOrders.includes(sortOrder.toUpperCase())
    ) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    }

    const stores = await sequelize.query(query, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT,
    });

    res.json({ stores: stores });
  } catch (error) {
    console.error("Get stores error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Submit or update rating
const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Validating rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Checking if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Checking if user already rated this store
    const existingRating = await Rating.findOne({
      where: {
        user_id: userId,
        store_id: storeId,
      },
    });

    if (existingRating) {
      // Updating existing rating
      await existingRating.update({ rating: rating });
      res.json({ message: "Rating updated successfully" });
    } else {
      // Inserting new rating
      await Rating.create({
        user_id: userId,
        store_id: storeId,
        rating: rating,
      });
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
