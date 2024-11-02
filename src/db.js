const fs = require("fs");
const mysql = require("mysql2");
require("dotenv").config({ path: "./db.env" });

const dbConfig =
    process.env.NODE_ENV === "production"
        ? JSON.parse(process.env.MySQL_Database)
        : {
            host: "helpinghands-db.mysql.database.azure.com",
            user: "supportingFingers32",
            password: "HkadL@d127",
            database: "UserDatabase",
            port: 3306,
            ssl: {
                ca: fs.readFileSync(${__dirname}/DigiCertGlobalRootCA.crt.pem),
                rejectUnauthorized: true,
            },
        };

const conn = mysql.createPool(dbConfig);

conn.getConnection((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
    } else {
        console.log("Connected to MySQL database.");
    }
});

module.exports = conn;