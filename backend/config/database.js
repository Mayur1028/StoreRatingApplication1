const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
require("dotenv").config();

// Function to create database if it doesn't exist
const createDatabaseIfNotExists = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "",
    });

    // Creating database if it doesn't exist
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
    );
    await connection.end();

    console.log(`Database '${process.env.DB_NAME}' ensured to exist`);
  } catch (error) {
    console.error("Error creating database:", error.message);
    throw error;
  }
};

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  logging: false,
  define: {
    timestamps: false,
  },
});

module.exports = { sequelize, createDatabaseIfNotExists };
