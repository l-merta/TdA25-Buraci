require("dotenv").config();
const mysql = require("mysql2/promise");

let connection;

const connectToDatabase = async () => {
  if (connection) {
    console.log("Database connection already established.");
    return connection; // Return the existing connection
  }

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,      // MySQL host from .env file
      user: process.env.DB_USER,      // MySQL user from .env file
      password: process.env.DB_PASSWORD, // MySQL password from .env file
      database: process.env.DB_NAME,      // MySQL database name from .env file
    });
    console.log("Connected to MySQL database.");
    return connection; // Return the new connection
  } catch (err) {
    console.error("Error connecting to MySQL database:", err);
    throw err;
  }
};

const getDb = () => {
  if (!connection) {
    throw new Error("Database connection not initialized. Call connectToDatabase first.");
  }
  return {
    run: async (sql, params = []) => {
      try {
        const [result] = await connection.execute(sql, params);
        return result;
      } catch (err) {
        throw err;
      }
    },
    all: async (sql, params = []) => {
      try {
        const [rows] = await connection.execute(sql, params);
        return rows;
      } catch (err) {
        throw err;
      }
    },
    get: async (sql, params = []) => {
      try {
        const [rows] = await connection.execute(sql, params);
        return rows[0];
      } catch (err) {
        throw err;
      }
    },
  };
};

const closeDatabase = async () => {
  if (connection) {
    try {
      await connection.end();
      //console.log("Closed MySQL database connection.");
    } catch (err) {
      console.error("Error closing MySQL database connection:", err);
    } finally {
      connection = null;
    }
  }
};

module.exports = { connectToDatabase, getDb, closeDatabase };
