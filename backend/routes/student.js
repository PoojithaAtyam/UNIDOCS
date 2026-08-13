const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const db = require("../config/db");


// ==========================================
// STUDENT LOGIN
// ==========================================

router.post("/login", (req, res) => {

    const { collegeID, password } = req.body;

    if (!collegeID || !password) {

        return res.status(400).json({
            success: false,
            message: "College ID and Password are required"
        });

    }

    const sql = `
        SELECT
            student_id,
            name,
            email,
            department,
            year,
            password_hash,
            first_login
        FROM students
        WHERE student_id = ?
    `;

    db.query(sql, [collegeID], async (err, results) => {

        if (err) {

            console.log("Database Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        if (results.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid College ID"
            });

        }

        const student = results[0];

        try {

            // Compare entered password with bcrypt hash
            const passwordCorrect = await bcrypt.compare(
                password,
                student.password_hash
            );

            if (!passwordCorrect) {

                return res.status(401).json({
                    success: false,
                    message: "Incorrect Password"
                });

            }

            // Login successful
            res.json({

                success: true,

                firstLogin: student.first_login,

                student: {

                    id: student.student_id,
                    name: student.name,
                    email: student.email,
                    department: student.department,
                    year: student.year

                }

            });

        } catch (error) {

            console.log("Password verification error:", error);

            return res.status(500).json({
                success: false,
                message: "Password verification failed"
            });

        }

    });

});


// ==========================================
// STUDENT CHANGE PASSWORD
// ==========================================

router.post("/change-password", async (req, res) => {

    const { studentID, newPassword } = req.body;

    if (!studentID || !newPassword) {

        return res.status(400).json({
            success: false,
            message: "Student ID and new password are required"
        });

    }

    try {

        // Hash the student's new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        const sql = `
            UPDATE students
            SET
                password_hash = ?,
                first_login = 0
            WHERE student_id = ?
        `;

        db.query(
            sql,
            [hashedPassword, studentID],
            (err, result) => {

                if (err) {

                    console.log("Database Error:", err);

                    return res.status(500).json({
                        success: false,
                        message: "Database Error"
                    });

                }

                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        success: false,
                        message: "Student not found"
                    });

                }

                res.json({

                    success: true,

                    message: "Password Changed Successfully"

                });

            }
        );

    } catch (error) {

        console.log("Password hashing error:", error);

        return res.status(500).json({
            success: false,
            message: "Password hashing failed"
        });

    }

});


module.exports = router;
router.post("/request-document", (req, res) => {

    const { studentID, documentType, purpose } = req.body;

    const checkSql = `
        SELECT COUNT(*) AS total
        FROM requests
        WHERE student_id = ?
        AND document_type = ?
        AND status='Approved'
    `;

    db.query(checkSql, [studentID, documentType], (err, result) => {

        if (err) {
            return res.status(500).json({
                success:false,
                message:"Database Error"
            });
        }

        if(result[0].total >= 2){

            return res.json({

                success:false,

                needSpecialRequest:true,

                message:"You already received this document twice."

            });

        }

        const insertSql = `
        INSERT INTO requests
        (
            student_id,
            document_type,
            purpose,
            expected_date,
            withdraw_until
        )
        VALUES
        (
            ?,
            ?,
            ?,
            DATE_ADD(CURDATE(),INTERVAL 3 DAY),
            DATE_ADD(NOW(),INTERVAL 12 HOUR)
        )
        `;

        db.query(insertSql,

        [

            studentID,

            documentType,

            purpose

        ],

        (err)=>{

            if(err){

                return res.status(500).json({

                    success:false,

                    message:"Database Error"

                });

            }

            res.json({

                success:true,

                message:"Request Submitted Successfully"

            });

        });

    });

});

router.get("/status/:studentID", (req, res) => {

    const studentID = req.params.studentID;

    const sql = `
        SELECT *
        FROM requests
        WHERE student_id = ?
        ORDER BY request_date DESC
    `;

    db.query(sql, [studentID], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error"
            });
        }

        results.forEach(request => {

            request.canWithdraw = false;

            if (
                request.status === "Pending" &&
                new Date() < new Date(request.withdraw_until)
            ) {
                request.canWithdraw = true;
            }

        });

        res.json(results);

    });

});

router.post("/special-request",(req,res)=>{

    const{

        studentID,

        documentType,

        reason

    }=req.body;

    const sql=`

    INSERT INTO special_requests

    (

        student_id,

        document_type,

        reason

    )

    VALUES

    (

        ?,

        ?,

        ?

    )

    `;

    db.query(sql,

    [

        studentID,

        documentType,

        reason

    ],

    err=>{

        if(err){

            return res.status(500).json({

                success:false,

                message:"Database Error"

            });

        }

        res.json({

            success:true,

            message:"Special Request Sent"

        });

    });

});

