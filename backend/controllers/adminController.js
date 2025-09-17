const bcrypt = require("bcryptjs");
const pool = require("../config/database");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const [userCount] = await pool.query("SELECT COUNT(*) as count FROM users");

    // Get total stores count
    const [storeCount] = await pool.query(
      "SELECT COUNT(*) as count FROM stores"
    );

    // Get total ratings count
    const [ratingCount] = await pool.query(
      "SELECT COUNT(*) as count FROM ratings"
    );

    res.json({
      totalUsers: userCount[0].count,
      totalStores: storeCount[0].count,
      totalRatings: ratingCount[0].count,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add new user
const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role = "user" } = req.body;

    // Validate input same as registration
    if (!name || name.length < 20 || name.length > 60) {
      return res
        .status(400)
        .json({ error: "Name must be between 20 and 60 characters" });
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    if (!password || password.length < 8 || password.length > 16) {
      return res
        .status(400)
        .json({ error: "Password must be between 8 and 16 characters" });
    }

    if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
      return res.status(400).json({
        error:
          "Password must contain at least one uppercase letter and one special character",
      });
    }

    if (!address || address.length > 400) {
      return res.status(400).json({
        error: "Address is required and must be less than 400 characters",
      });
    }

    // Check if user already exists
    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({
      message: "User added successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Add user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add new store
const addStore = async (req, res) => {
  try {
    const { name, email, address, ownerEmail } = req.body;

    if (!name || !email || !address) {
      return res
        .status(400)
        .json({ error: "Name, email, and address are required" });
    }

    if (address.length > 400) {
      return res
        .status(400)
        .json({ error: "Address must be less than 400 characters" });
    }

    // Check if store email already exists
    const [existingStore] = await pool.query(
      "SELECT id FROM stores WHERE email = ?",
      [email]
    );
    if (existingStore.length > 0) {
      return res
        .status(400)
        .json({ error: "Store already exists with this email" });
    }

    let ownerId = null;

    // If owner email provided, find the owner and update their role
    if (ownerEmail) {
      const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [
        ownerEmail,
      ]);
      if (users.length === 0) {
        return res
          .status(400)
          .json({ error: "Owner with this email not found" });
      }

      ownerId = users[0].id;

      // Update user role to store_owner
      await pool.query("UPDATE users SET role = ? WHERE id = ?", [
        "store_owner",
        ownerId,
      ]);
    }

    // Insert new store
    const [result] = await pool.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, ownerId]
    );

    res.status(201).json({
      message: "Store added successfully",
      storeId: result.insertId,
    });
  } catch (error) {
    console.error("Add store error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all users with optional filters
const getUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = "name",
      sortOrder = "ASC",
    } = req.query;

    let query = "SELECT id, name, email, address, role FROM users WHERE 1=1";
    const params = [];

    // Apply filters
    if (name) {
      query += " AND name LIKE ?";
      params.push(`%${name}%`);
    }
    if (email) {
      query += " AND email LIKE ?";
      params.push(`%${email}%`);
    }
    if (address) {
      query += " AND address LIKE ?";
      params.push(`%${address}%`);
    }
    if (role) {
      query += " AND role = ?";
      params.push(role);
    }

    // Add sorting
    const validSortFields = ["name", "email", "address", "role"];
    const validSortOrders = ["ASC", "DESC"];

    if (
      validSortFields.includes(sortBy) &&
      validSortOrders.includes(sortOrder.toUpperCase())
    ) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    }

    const [users] = await pool.query(query, params);
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all stores with ratings
const getStores = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      sortBy = "name",
      sortOrder = "ASC",
    } = req.query;

    let query = `
      SELECT 
        s.id, s.name, s.email, s.address,
        ROUND(AVG(r.rating), 2) as rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [];

    // Apply filters
    if (name) {
      query += " AND s.name LIKE ?";
      params.push(`%${name}%`);
    }
    if (email) {
      query += " AND s.email LIKE ?";
      params.push(`%${email}%`);
    }
    if (address) {
      query += " AND s.address LIKE ?";
      params.push(`%${address}%`);
    }

    query += " GROUP BY s.id, s.name, s.email, s.address";

    // Add sorting
    const validSortFields = ["name", "email", "address", "rating"];
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

// Get user details by ID
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT 
        u.id, u.name, u.email, u.address, u.role
    `;

    // If user is a store owner, also get their store rating
    query += `
      , CASE 
          WHEN u.role = 'store_owner' THEN (
            SELECT ROUND(AVG(r.rating), 2)
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.owner_id = u.id
          )
          ELSE NULL
        END as rating
      FROM users u
      WHERE u.id = ?
    `;

    const [users] = await pool.query(query, [id]);

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(users[0]);
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getDashboardStats,
  addUser,
  addStore,
  getUsers,
  getStores,
  getUserDetails,
};
