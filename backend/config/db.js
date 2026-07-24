const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "159357",
    database: "UNIDOCS"
});

connection.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
        return;
    }

    console.log("✅ Connected to MySQL Database");
});

module.exports = connection;