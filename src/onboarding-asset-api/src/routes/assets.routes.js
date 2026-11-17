const express = require("express");
const router = express.Router();

const assetController = require("../controllers/assets.controller");

// Retrieve all website assets
router.get("/", assetController.getAllAssets);

// Retrieve a specific website asset
router.get("/:title", assetController.getAssetByTitle);

module.exports = router;