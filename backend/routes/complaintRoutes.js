const express = require("express");
const db = require("../config/database");

const router = express.Router();

// Test route
router.get("/", (req, res) => {
    res.json({
        message: "Complaints API is working 🚀"
    });
});

// Create a new complaint
router.post("/", (req, res) => {
    const {
        id,
        user_id,
        title,
        category,
        priority,
        location,
        description,
        status,
        image
    } = req.body;

    // Validate required fields
    if (
        !id ||
        !user_id ||
        !title ||
        !category ||
        !priority ||
        !location ||
        !description
    ) {
        return res.status(400).json({
            message: "Please provide all required complaint details"
        });
    }

    const sql = `
        INSERT INTO complaints
        (id, user_id, title, category, priority, location, description, status, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        id,
        user_id,
        title,
        category,
        priority,
        location,
        description,
        status || "Pending",
        image || null
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error creating complaint:", err.message);

            return res.status(500).json({
                message: "Failed to create complaint"
            });
        }

        res.status(201).json({
            message: "Complaint created successfully",
            complaintId: id
        });
    });
});

// Get all complaints
router.get("/all", (req, res) => {
    const sql = "SELECT * FROM complaints ORDER BY created_at DESC";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching complaints:", err.message);

            return res.status(500).json({
                message: "Failed to fetch complaints"
            });
        }

        res.json(results);
    });
});

// Get one complaint by ID
router.get("/:id", (req, res) => {
    const complaintId = req.params.id;

    const sql = "SELECT * FROM complaints WHERE id = ?";

    db.query(sql, [complaintId], (err, results) => {
        if (err) {
            console.error("Error fetching complaint:", err.message);

            return res.status(500).json({
                message: "Failed to fetch complaint"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.json(results[0]);
    });
});

// Update complaint status
router.put("/:id/status", (req, res) => {
    const complaintId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            message: "Status is required"
        });
    }

    const sql = "UPDATE complaints SET status = ? WHERE id = ?";

    db.query(sql, [status, complaintId], (err, result) => {
        if (err) {
            console.error("Error updating complaint:", err.message);

            return res.status(500).json({
                message: "Failed to update complaint"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.json({
            message: "Complaint status updated successfully",
            complaintId: complaintId,
            status: status
        });
    });
});

// Delete a complaint
router.delete("/:id", (req, res) => {
    const complaintId = req.params.id;

    const sql = "DELETE FROM complaints WHERE id = ?";

    db.query(sql, [complaintId], (err, result) => {
        if (err) {
            console.error("Error deleting complaint:", err.message);

            return res.status(500).json({
                message: "Failed to delete complaint"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.json({
            message: "Complaint deleted successfully",
            complaintId: complaintId
        });
    });
});

module.exports = router;