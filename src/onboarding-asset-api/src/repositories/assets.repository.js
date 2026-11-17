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
function getAssetByTitle(title) {
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
        WHERE title = ?
    `).get(title);
}

module.exports = {
    getAllAssets,
    getAssetByTitle
};