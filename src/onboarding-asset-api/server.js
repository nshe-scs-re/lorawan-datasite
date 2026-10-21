const express = require("express");
const db = require("./db");

const app = express();

app.use(express.json);

// Check whether the API is running
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

// Retrieve all assets
app.get("/api/assets", (req, res) => {
    try {
        const assets = db
            .prepare("SELECT * FROM assets")
            .all();

        res.json(assets);
    } catch (error) {
        console.error("Failed to retrieve assets:", error.message);

        res.status(500).json({
            error: "Failed to retrieve assets"
        });
    }
});

// need to not hardcode this mayhaps
app.listen(3000, () => {
    console.log("API running on port 3000");
});