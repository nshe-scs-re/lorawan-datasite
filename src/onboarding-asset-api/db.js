// For db connection

const Database = require("better-sqlite3");
const path = require("node:path");

const dbPath = path.resolve(
    __dirname,
    "../../db/web_assets.db"
);

const db = new Database(dbPath);
// Enable foreign key enforcement.
db.pragma("foreign_keys = ON");

module.exports = db;