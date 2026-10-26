// For db initialization

const Database = require("../src/onboarding-asset-api/node_modules/better-sqlite3");
const fs = require("node:fs");
const path = require('path');

const dbPath = path.join(__dirname, 'web_assets.db');
const schemaPath = path.join(
    __dirname,
    "web_assets_schema.sql"
);

const db = new Database(dbPath);

// As listed in the schema, foreign keys needs to be on for cascade DELETE.
db.pragma('foreign_keys = ON');

try {
    const schema = fs.readFileSync(schemaPath, "utf8");

    db.exec(schema);

    console.log("Database initialized successfully.");
} finally {
    db.close();
}

module.exports = db;