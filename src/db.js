const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "helpinghands-db.mysql.database.azure.com",
  user: "cyber",                       
  password: "XnGNy605",                
  database: "UserDatabase",          
  ssl: {
    rejectUnauthorized: true,          
  },
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the MySQL database.");
  }
});

module.exports = connection; 