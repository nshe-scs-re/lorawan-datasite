const express = require("express");
const db = require("./db");

const app = express();

app.use(express.json());

// Endpoint
app.get("/asset", (req, res) => {
    try {
        const asset = db.prepare(
            "SELECT * FROM asset"
        ).all();

        res.json(asset);
    } catch (error) {
        console.error("Failed to retrieve assets:", error);

        res.status(500).json({
            error: "Failed to retrieve assets"
        });
    }
});

app.get("/", (req, res) => {
    res.send("Onboarding API is running!");
});

app.listen(3000, () => {
    console.log("API running on port 3000");
});

