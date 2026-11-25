const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
    res.send("Auth Routes Working!");
});


// =====================================
// STUDENT REGISTRATION
// =====================================

router.post("/register", async (req, res) => {
    try {
        const { name, email, college, password } = req.body;

        if (!name || !email || !college || !password) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingStudent = await Student.findOne({
            email: normalizedEmail
        });

        if (existingStudent) {
            return res.status(400).json({
                message: "Email is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = new Student({
            name: name.trim(),
            email: normalizedEmail,
            college: college.trim(),
            password: hashedPassword
        });

        await newStudent.save();

        res.status(201).json({
            message: "Registration successful!"
        });

    } catch (error) {
        console.error("Registration Error:", error);

        res.status(500).json({
            message: "Registration failed"
        });
    }
});


// =====================================
// STUDENT LOGIN WITH JWT
// =====================================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }

        const student = await Student.findOne({
            email: email.trim().toLowerCase()
        });

        if (!student) {
            return res.status(400).json({
                message: "Student not found. Please register."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            student.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "Authentication configuration error"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                studentId: student._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful!",

            token: token,

            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                college: student.college
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: "Login failed"
        });
    }
});

module.exports = router;