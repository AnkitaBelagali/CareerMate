const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());


// IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");
const studyGoalRoutes = require("./routes/studyGoalRoutes");
const performanceRoutes = require("./routes/performanceRoutes");


// CONNECT API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/study-goals", studyGoalRoutes);
app.use("/api/performance", performanceRoutes);


// API TEST ROUTE
app.get("/api/auth/test", (req, res) => {
    res.json({
        message: "CareerMate API Working!"
    });
});


// HANDLE UNKNOWN API ROUTES
app.use("/api", (req, res) => {
    res.status(404).json({
        message: "API endpoint not found",
        endpoint: req.originalUrl
    });
});


// BLOCK BACKEND FILE ACCESS
app.use((req, res, next) => {

    if (
        req.path.startsWith("/backend") ||
        req.path.startsWith("/node_modules")
    ) {
        return res.sendStatus(404);
    }

    next();
});


// SERVE FRONTEND FILES
app.use(express.static(path.join(__dirname, "..")));


// HOME PAGE
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "index.html")
    );
});


// HANDLE FRONTEND 404
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


// MONGODB CONNECTION AND SERVER START
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI)

    .then(() => {

        console.log("MongoDB Connected Successfully!");

        app.listen(PORT, "0.0.0.0", () => {

            console.log(
                `CareerMate server running on port ${PORT}`
            );

        });

    })

    .catch((error) => {

        console.error("MongoDB Connection Error:", error);

        process.exit(1);

    });