const Database = require("better-sqlite3");
const path = require("node:path");

const dbPath = path.resolve(
    _dirname,
    "../../database/test.db"
);

const db = new Database(dbPath);
module.exports = db;