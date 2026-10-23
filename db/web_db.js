const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'web_assets.db');
const db = new Database(dbPath);

// As listed in the schema, foreign keys needs to be on for cascade DELETE.
db.pragma('foreign_keys = ON');

module.exports = db;