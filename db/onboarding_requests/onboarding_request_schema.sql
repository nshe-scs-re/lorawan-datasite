-- Author: Jacob Campau

-- 'PRAGMA foreign_keys = ON' must be included on each application connection. This allows for cascading DELETE.
PRAGMA foreign_keys = ON;

-- Main onboard request table. The status is 0 for pending, 1 for accepted, and 2 for denied
CREATE TABLE IF NOT EXISTS onboard_requests (
    request_id INTEGER PRIMARY KEY,
    status_id INTEGER NOT NULL
);

-- Holds comment(s) for sensors
CREATE TABLE IF NOT EXISTS device_comment (
    comment_id INTEGER PRIMARY KEY,
    request_id INTEGER NOT NULL,
    datetime TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    comment TEXT NOT NULL CHECK (length(trim(comment)) > 0),
    FOREIGN KEY (request_id) REFERENCES onboard_requests(request_id) ON DELETE CASCADE
);

-- Sensor type information
CREATE TABLE IF NOT EXISTS sensor_type (
    sensor_type_id INTEGER PRIMARY KEY,
    make TEXT NOT NULL CHECK (length(trim(make)) > 0),
    model TEXT NOT NULL CHECK (length(trim(model)) > 0),
    description TEXT,
    UNIQUE (make, model)
);

-- Metadata for sensor erd
CREATE TABLE IF NOT EXISTS device_metadata (
    metadata_id INTEGER PRIMARY KEY,
    request_id INTEGER NOT NULL,
    sensor_type_id INTEGER NOT NULL,
    name TEXT NOT NULL CHECK (length(trim(name)) > 0),
    dev_eui TEXT NOT NULL CHECK (length(trim(dev_eui)) > 0),
    dev_address TEXT NOT NULL CHECK (length(trim(dev_address)) > 0),
    nws_key TEXT NOT NULL CHECK (length(trim(nws_key)) > 0),
    app_s_key TEXT NOT NULL CHECK (length(trim(app_s_key)) > 0),
    otaa_app_key TEXT NOT NULL CHECK (length(trim(otaa_app_key)) > 0),
    at_pin TEXT NOT NULL CHECK (length(trim(at_pin)) > 0),
    ota_pin TEXT NOT NULL CHECK (length(trim(ota_pin)) > 0),
    serial_no TEXT NOT NULL CHECK (length(trim(serial_no)) > 0),
    FOREIGN KEY (request_id) REFERENCES onboard_requests(request_id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_type_id) REFERENCES sensor_type(sensor_type_id) ON DELETE RESTRICT
);

-- Image(s) for a sensor
CREATE TABLE IF NOT EXISTS device_image (
    image_id INTEGER PRIMARY KEY,
    request_id INTEGER NOT NULL,
    datetime TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    image_type TEXT NOT NULL CHECK (length(trim(image_type)) > 0),
    image_path TEXT NOT NULL UNIQUE CHECK (length(trim(image_path)) > 0),
    FOREIGN KEY (request_id) REFERENCES onboard_requests(request_id) ON DELETE CASCADE
);

-- Project name
CREATE TABLE IF NOT EXISTS project (
    project_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (length(trim(name)) > 0)
);

-- History(s) of a project name
CREATE TABLE IF NOT EXISTS project_history (
    project_history_id INTEGER PRIMARY KEY,
    request_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    deployment_datetime TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    longitude REAL NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    latitude REAL NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    contact_first_name TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (length(trim(contact_first_name)) > 0),
    contact_last_name TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (length(trim(contact_last_name)) > 0),
    contact_email TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (length(trim(contact_email)) > 0),
    FOREIGN KEY (request_id) REFERENCES onboard_requests(request_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE RESTRICT
);