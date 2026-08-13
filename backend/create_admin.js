const bcrypt = require("bcrypt");
const db = require("./config/db");

async function createAdmin() {

    const adminID = "ADM001";
    const username = "admin";
    const name = "UNIDOCS Administrator";
    const email = "admin@gmail.com";
    const password = "Admin@123";

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO admins
            (
                admin_id,
                username,
                name,
                email,
                password_hash,
                active
            )
            VALUES (?, ?, ?, ?, ?, 1)
        `;

        db.query(
            sql,
            [
                adminID,
                username,
                name,
                email,
                hashedPassword
            ],
            (err, result) => {

                if (err) {

                    console.log("Error creating admin:", err);

                    db.end();

                    return;
                }

                console.log("Admin created successfully.");
                console.log("Admin ID:", adminID);
                console.log("Username:", username);
                console.log("Password:", password);

                db.end();
            }
        );

    } catch (error) {

        console.log("Password hashing error:", error);

        db.end();
    }
}

createAdmin();