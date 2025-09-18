// models/Store.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Store = sequelize.define(
  "Store",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "stores",
    timestamps: false,
  }
);

module.exports = Store;
