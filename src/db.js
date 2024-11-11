const fs = require("fs");
const mysql = require("mysql2/promise"); // Use `mysql2/promise` to support async/await
require("dotenv").config({ path: "./db.env" });

const dbConfig = 
  process.env.NODE_ENV === "production"
    ? JSON.parse(process.env.MySQL_Database)
    : {
        host: "helpinghands-db.mysql.database.azure.com",
        user: "supportingFingers32",
        password: "HkadL@d127",
        database: "userdatabase",
        port: 3306,
        ssl: {
            ca: fs.readFileSync(`${__dirname}/../DigiCertGlobalRootCA.crt.pem`), // Adjusted path
            rejectUnauthorized: true,
        },
    };

const db = mysql.createPool(dbConfig); // Pool is now Promise-compatible

// Test the connection
db.getConnection()
  .then(() => console.log("Connected to MySQL database."))
  .catch((err) => console.error("Database connection failed:", err));

module.exports = db;
