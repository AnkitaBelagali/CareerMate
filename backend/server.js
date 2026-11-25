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


// AUTHENTICATION TEST ROUTE
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


// MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI)

    .then(() => {
        console.log("MongoDB Connected Successfully!");
    })

    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });


// START SERVER
const PORT = 5001;

app.listen(PORT, () => {

    console.log(
        `CareerMate server running on http://localhost:${PORT}`
    );

    const websiteURL = `http://localhost:${PORT}`;

    // AUTOMATICALLY OPEN WEBSITE
    setTimeout(() => {

        const { exec } = require("child_process");

        if (process.platform === "win32") {
            exec(`start "" "${websiteURL}"`);
        }

        else if (process.platform === "darwin") {
            exec(`open "${websiteURL}"`);
        }

        else {
            exec(`xdg-open "${websiteURL}"`);
        }

    }, 1000);

});