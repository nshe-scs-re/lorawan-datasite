const db = require("../../db");

function getAllAssets() {
    return db.prepare(`
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
}

// Retrieve a specific website asset
function getAssetById(id) {
    return db.prepare(`
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
    `).get(id);
}

module.exports = {
    getAllAssets,
    getAssetById
};