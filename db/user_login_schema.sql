-- 'PRAGMA foreign_keys = ON' must be included on each application connection. This allows for cascading DELETE.
PRAGMA foreign_keys = ON;

-- User information for wensite.
CREATE TABLE IF NOT EXISTS user_information (
    user_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL CHECK (length(trim(first_name)) > 0),
    last_name TEXT NOT NULL CHECK (length(trim(last_name)) > 0),
    email TEXT NOT NULL UNIQUE CHECK (length(trim(email)) > 0),
    password_hash TEXT NOT NULL UNIQUE CHECK (length(trim(password_hash)) > 0),
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    can_onboard INTEGER NOT NULL DEFAULT 0 CHECK (can_onboard IN (0, 1))
);

-- Logs for logging into the website for wensite.
CREATE TABLE IF NOT EXISTS user_activity (
    activity_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    ip_address TEXT NOT NULL CHECK (length(trim(ip_address)) > 0),
    logged_in_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_information(user_id) ON DELETE CASCADE
);