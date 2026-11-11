// For db initialization
// Author: Jacob Campau

const Database = require("better-sqlite3");
const fs = require("node:fs"); // Edited: Paulane Tulop
const path = require('path');

const dbPath = path.join(__dirname, 'web_assets.db');

// Edited: Paulane Tulop
const schemaPath = path.join(
    __dirname,
    "web_assets_schema.sql"
);

const db = new Database(dbPath);

// As listed in the schema, foreign keys needs to be on for cascade DELETE.
db.pragma('foreign_keys = ON');

// Edited: Paulane Tulop
try {
    const schema = fs.readFileSync(schemaPath, "utf8");

    db.exec(schema);

    console.log("Website asset database initialized successfully.");
} finally {
    db.close();
}