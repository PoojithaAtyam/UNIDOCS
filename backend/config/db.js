const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "159357",   // Your MySQL password
    database: "unidocs"
});

connection.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL Database");
    }
});

module.exports = connection;