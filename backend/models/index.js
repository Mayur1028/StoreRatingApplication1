const { sequelize, createDatabaseIfNotExists } = require("../config/database");
const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// Define relationships
User.hasOne(Store, { foreignKey: "owner_id", as: "ownedStore" });
Store.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

User.hasMany(Rating, { foreignKey: "user_id", as: "ratings" });
Rating.belongsTo(User, { foreignKey: "user_id", as: "user" });

Store.hasMany(Rating, { foreignKey: "store_id", as: "ratings" });
Rating.belongsTo(Store, { foreignKey: "store_id", as: "store" });

// Create default users and data
const createDefaultData = async () => {
  try {
    const userCount = await User.count();

    if (userCount === 0) {
      // Create admin
      const admin = await User.create({
        name: "System Administrator",
        email: "admin@admin.com",
        password: "Admin@123",
        role: "admin",
      });

      // Store Owners
      const storeOwner1 = await User.create({
        name: "Raju Kalbande Junior 1",
        email: "raju@gmail.com",
        password: "Owner@123",
        address:
          "NH-48, Near Toll Naka, Vashi, Navi Mumbai, Maharashtra – 400703",
        role: "store_owner",
      });

      const storeOwner2 = await User.create({
        name: "Raju Kalbande Junior 2",
        email: "raju12@gmail.com",
        password: "Mayur@123",
        address:
          "2nd Floor, Koti Market, Abids Road, Hyderabad, Telangana – 500001",
        role: "store_owner",
      });

      const storeOwner3 = await User.create({
        name: "Raju Kalbande Junior 3",
        email: "raju123@gmail.com",
        password: "Owner@123",
        address:
          "45/12, Gandhi Bazaar Main Road, Basavanagudi, Bengaluru, Karnataka – 560004",
        role: "store_owner",
      });

      // Regular Users
      const user1 = await User.create({
        name: "Mayur Kalbande Junior 1",
        email: "mayur@gmail.com",
        password: "Mayur@123",
        address: "123 Park Street, Pune, Maharashtra",
        role: "user",
      });

      const user2 = await User.create({
        name: "Mayur Kalbande Junior 2",
        email: "mayur12@gmail.com",
        password: "User@123",
        address: "Sector 15, Noida, Uttar Pradesh",
        role: "user",
      });

      const user3 = await User.create({
        name: "Mayur Kalbande Junior 3",
        email: "mayur123@gmail.com",
        password: "User@123",
        address: "MG Road, Indore, Madhya Pradesh",
        role: "user",
      });

      // Stores
      const store1 = await Store.create({
        name: "Sagar Ratna Family Dhaba",
        email: "contact@sagarratna.com",
        address:
          "NH-48, Near Toll Naka, Vashi, Navi Mumbai, Maharashtra – 400703",
        owner_id: storeOwner1.id,
      });

      const store2 = await Store.create({
        name: "Kalyani Handloom Sarees",
        email: "info@kalyanisarees.com",
        address:
          "2nd Floor, Koti Market, Abids Road, Hyderabad, Telangana – 500001",
        owner_id: storeOwner2.id,
      });

      const store3 = await Store.create({
        name: "Spice Junction Supermart",
        email: "hello@spicejunction.com",
        address:
          "45/12, Gandhi Bazaar Main Road, Basavanagudi, Bengaluru, Karnataka – 560004",
        owner_id: storeOwner3.id,
      });

      // Ratings (Sample)
      await Rating.create({
        user_id: user1.id,
        store_id: store1.id,
        rating: 5,
      });
      await Rating.create({
        user_id: user2.id,
        store_id: store1.id,
        rating: 4,
      });
      await Rating.create({
        user_id: user3.id,
        store_id: store2.id,
        rating: 5,
      });
      await Rating.create({
        user_id: user1.id,
        store_id: store3.id,
        rating: 3,
      });
      await Rating.create({
        user_id: user2.id,
        store_id: store3.id,
        rating: 4,
      });

      console.log("✅ Default data created successfully!");
      console.log("");
      console.log("=== Login credentials ===");
      console.log("Admin: admin@admin.com / Admin@123");
      console.log("Store Owners:");
      console.log("  raju@gmail.com / Owner@123");
      console.log("  raju12@gmail.com / Mayur@123");
      console.log("  raju123@gmail.com / Owner@123");
      console.log("Users:");
      console.log("  mayur@gmail.com / Mayur@123");
      console.log("  mayur12@gmail.com / User@123");
      console.log("  mayur123@gmail.com / User@123");
    }
  } catch (error) {
    console.error("❌ Error creating default data:", error);
  }
};

// Sync database
const syncDatabase = async () => {
  try {
    await createDatabaseIfNotExists();
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✅ Database connected and synced");
    await createDefaultData();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
  syncDatabase,
};
