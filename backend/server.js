const express = require("express");
const cors = require("cors");
const complaintRoutes = require("./routes/complaintRoutes");
const userRoutes = require("./routes/userRoutes");
const db = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Complaints API
app.use("/api/complaints", complaintRoutes);
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "CampusFix Backend is running 🚀"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`CampusFix server running on http://localhost:${PORT}`);
});