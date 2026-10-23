-- 'PRAGMA foreign_keys = ON' must be included on each application connection. This allows for cascading DELETE.
PRAGMA foreign_keys = ON;

-- Asset data for website.
CREATE TABLE IF NOT EXISTS asset (
    asset_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    description TEXT,
    file_path TEXT NOT NULL UNIQUE CHECK (length(trim(file_path)) > 0),
    file_type TEXT NOT NULL CHECK (length(trim(file_type)) > 0),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tag and category information tables.
CREATE TABLE IF NOT EXISTS category (
    category_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (length(trim(name)) > 0)
);

CREATE TABLE IF NOT EXISTS tag (
    tag_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (length(trim(name)) > 0)
);

-- Searchable tag and category tables.
CREATE TABLE IF NOT EXISTS asset_category (
    asset_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (asset_id, category_id),
    FOREIGN KEY (asset_id) REFERENCES asset(asset_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS asset_tag (
    asset_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (asset_id, tag_id),
    FOREIGN KEY (asset_id) REFERENCES asset(asset_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(tag_id) ON DELETE CASCADE
);

-- These indicies support filtering by category_id and tag_id.
CREATE INDEX IF NOT EXISTS idx_asset_category_category_id ON asset_category(category_id);
CREATE INDEX IF NOT EXISTS idx_asset_tag_tag_id ON asset_tag(tag_id);

-- This triggers on asset changes. Updates the timestamp in asset table.
CREATE TRIGGER IF NOT EXISTS trg_asset_updated_at
AFTER UPDATE OF title, description, file_path, file_type ON asset
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE asset
    SET updated_at = CURRENT_TIMESTAMP
    WHERE asset_id = NEW.asset_id;
END;
