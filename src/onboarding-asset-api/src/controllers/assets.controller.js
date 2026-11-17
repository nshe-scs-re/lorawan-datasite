const assetRepository = require("../repositories/assets.repository");

function getAllAssets(req, res) {
    try {
        const assets = assetRepository.getAllAssets();

        res.json(assets);

    } catch (error) {
        console.error("Failed to retrieve assets:", error);

        res.status(500).json({
            error: "Failed to retrieve assets"
        });
    }
}

function getAssetByTitle(req, res) {
    try {
        const { title } = req.params;

        const asset = assetRepository.getAssetByTitle(title);

        if (!asset) {
            return res.status(404).json({
                error: "Asset not found"
            });
        }

        res.json(asset);

    } catch (error) {
        console.error("Error retrieving asset:", error);
        res.status(500).json({
            error: "Failed to retrieve asset"
        });
    }
}

module.exports = {
    getAllAssets,
    getAssetByTitle
};