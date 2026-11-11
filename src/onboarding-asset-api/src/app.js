const express = require("express");

const assetRoutes = require("./routes/assets.routes");

const app = express();

app.use(express.json());

app.use("/api/assets", assetRoutes);

// api health check
app.get("/", (req, res) => {
    res.send("LoRaWAN DataSite API is running!");
});

module.exports = app;