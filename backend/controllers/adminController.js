const bcrypt = require("bcryptjs");
const { User, Store, Rating, sequelize } = require("../models");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total users count using model
    const totalUsers = await User.count();

    // Get total stores count using model
    const totalStores = await Store.count();

    // Get total ratings count using model
    const totalRatings = await Rating.count();

    res.json({
      stats: {
        totalUsers,
        totalStores,
        totalRatings,
      },
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

    // Check if user already exists using model
    const existingUser = await User.findOne({
      where: { email },
      attributes: ["id"],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // Hash password manually
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user using model
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    res.status(201).json({
      message: "User added successfully",
      userId: user.id,
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

    // Check if store email already exists using model
    const existingStore = await Store.findOne({
      where: { email },
      attributes: ["id"],
    });

    if (existingStore) {
      return res
        .status(400)
        .json({ error: "Store already exists with this email" });
    }

    let ownerId = null;

    // If owner email provided find the owner and update their role
    if (ownerEmail) {
      const user = await User.findOne({
        where: { email: ownerEmail },
        attributes: ["id"],
      });

      if (!user) {
        return res
          .status(400)
          .json({ error: "Owner with this email not found" });
      }

      ownerId = user.id;

      // Update user role to store_owner using model
      await user.update({ role: "store_owner" });
    }

    // Create new store using model
    const store = await Store.create({
      name,
      email,
      address,
      owner_id: ownerId,
    });

    res.status(201).json({
      message: "Store added successfully",
      storeId: store.id,
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

    // Use raw query for complex filtering but through sequelize
    const users = await sequelize.query(query, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT,
    });

    res.json({ users });
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

    // Use raw query as it cannot be done with model directly
    const stores = await sequelize.query(query, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT,
    });

    res.json({ stores });
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

    // Use raw query as it cannot be done with model directly
    const users = await sequelize.query(query, {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    });

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
