const express = require("express");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Retrieve all website assets
app.get("/api/assets", (req, res) => {
    try {
        const assets = db.prepare(`
            SELECT
                asset_id,
                title,
                description,
                file_path,
                file_type,
                created_at,
                updated_at
            FROM asset
            ORDER BY asset_id
        `).all();

        res.json(assets);
    } catch (error) {
        console.error("Failed to retrieve assets:", error);

        res.status(500).json({
            error: "Failed to retrieve assets"
        });
    }
});

// Retrieve a specific website asset
app.get("/api/assets/:id", (req, res) => {
    try {
        const asset = db.prepare(`
            SELECT
                asset_id,
                title,
                description,
                file_path,
                file_type,
                created_at,
                updated_at
            FROM asset
            WHERE asset_id = ?
        `).get(req.params.id);

        if (!asset) {
            return res.status(404).json({
                error: "Asset not found"
            });
        }

        res.json(asset);
    } catch (error) {
        console.error("Failed to retrieve asset:", error);

        res.status(500).json({
            error: "Failed to retrieve asset"
        });
    }
});

// API health check
app.get("/", (req, res) => {
    res.send("LoRaWAN DataSite API is running!");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`API running on port ${PORT}`);
});
