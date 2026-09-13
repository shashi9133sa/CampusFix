const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../config/database");

const router = express.Router();


/* ================= GET API ================= */

router.get("/", (req, res) => {

    res.json({
        message: "Users API is working 🚀"
    });

});


/* ================= CREATE USER ================= */

/* ================= CREATE USER ================= */

router.post("/", async (req, res) => {

    const {
        name,
        student_id,
        department,
        year,
        email,
        password,
        role
    } = req.body;


    if (
        !name ||
        !student_id ||
        !department ||
        !year ||
        !email ||
        !password
    ) {

        return res.status(400).json({
            message:
                "Name, student ID, department, year, email and password are required"
        });

    }


    try {

        const hashedPassword =
            await bcrypt.hash(password, 10);


        const sql = `
            INSERT INTO users
            (name, student_id, department, year, email, password, role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;


        const values = [
            name,
            student_id,
            department,
            Number(year),
            email,
            hashedPassword,
            role || "student"
        ];


        db.query(
            sql,
            values,
            (err, result) => {

                if (err) {

                    console.error(
                        "Error creating user:",
                        err.message
                    );


                    if (err.code === "ER_DUP_ENTRY") {

                        return res.status(409).json({
                            message:
                                "An account with this email already exists."
                        });

                    }


                    return res.status(500).json({
                        message:
                            "Failed to create user"
                    });

                }


                res.status(201).json({

                    message:
                        "User created successfully",

                    userId:
                        result.insertId

                });

            }
        );

    } catch (error) {

        console.error(
            "Password hashing error:",
            error.message
        );


        res.status(500).json({
            message:
                "Failed to create user"
        });

    }

});


/* ================= GET ALL USERS ================= */

router.get("/all", (req, res) => {

    const sql = `
    SELECT
        id,
        name,
        student_id,
        department,
        year,
        email,
        role,
        created_at
    FROM users
    ORDER BY created_at DESC
`;


    db.query(
        sql,
        (err, results) => {

            if (err) {

                console.error(
                    "Error fetching users:",
                    err.message
                );


                return res.status(500).json({
                    message: "Failed to fetch users"
                });

            }


            res.json(results);

        }
    );

});


/* ================= LOGIN ================= */

router.post("/login", (req, res) => {

    const {
        email,
        password,
        role
    } = req.body;


    if (!email || !password) {

        return res.status(400).json({
            message: "Email and password are required"
        });

    }


    const sql = `
        SELECT id, name, email, password, role
        FROM users
        WHERE email = ?
        AND role = ?
    `;


    db.query(
        sql,
        [email, role],
        async (err, results) => {

            if (err) {

                console.error(
                    "Login error:",
                    err.message
                );


                return res.status(500).json({
                    message: "Login failed"
                });

            }


            if (results.length === 0) {

                return res.status(401).json({
                    message: "Invalid email or password"
                });

            }


            const user =
                results[0];


            try {

                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );


                if (!passwordMatch) {

                    return res.status(401).json({
                        message: "Invalid email or password"
                    });

                }


                delete user.password;


                res.json({

                    message: "Login successful",

                    user: user

                });


            } catch (error) {

                console.error(
                    "Password verification error:",
                    error.message
                );


                res.status(500).json({
                    message: "Login failed"
                });

            }

        }
    );

});


/* ================= GET USER BY ID ================= */

router.get("/:id", (req, res) => {

    const userId =
        req.params.id;


    const sql = `
        SELECT id, name, email, role, created_at
        FROM users
        WHERE id = ?
    `;


    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {

                console.error(
                    "Error fetching user:",
                    err.message
                );


                return res.status(500).json({
                    message: "Failed to fetch user"
                });

            }


            if (results.length === 0) {

                return res.status(404).json({
                    message: "User not found"
                });

            }


            res.json(results[0]);

        }
    );

});


module.exports = router;