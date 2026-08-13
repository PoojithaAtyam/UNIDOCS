const bcrypt = require("bcrypt");
const db = require("./config/db");

const students = [
    {
        student_id: "2024002",
        password: "2024002"
    },
    {
        student_id: "2024003",
        password: "2024003"
    },
    {
        student_id: "202412",
        password: "202412"
    }
];

async function migratePasswords() {

    try {

        for (const student of students) {

            const hashedPassword = await bcrypt.hash(
                student.password,
                10
            );

            await new Promise((resolve, reject) => {

                const sql = `
                    UPDATE students
                    SET password_hash = ?
                    WHERE student_id = ?
                `;

                db.query(
                    sql,
                    [hashedPassword, student.student_id],
                    (err, result) => {

                        if (err) {
                            reject(err);
                            return;
                        }

                        console.log(
                            `Password migrated for student ${student.student_id}`
                        );

                        resolve();
                    }
                );

            });

        }

        console.log("All student passwords migrated successfully.");

        db.end();

    } catch (error) {

        console.error(
            "Password migration failed:",
            error
        );

        db.end();

    }

}

migratePasswords();