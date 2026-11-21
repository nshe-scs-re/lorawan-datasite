import { MapSensor } from "../models/MapSensor";
import { SensorComment } from "../../sensor_information/models/SensorComment";
import { ProjectHistory } from "../../sensor_information/models/ProjectHistory";
import { Project } from "../../sensor_information/models/Project";
import { Deployment } from "../../sensor_information/models/Deployment";
import { Data } from "../../data/models/Data";
import { getLatestData } from "../../data/services/DataService";
import { mockSensors, USE_MOCK_SENSORS } from "../../../test_sensors/mockSensors";

// One row of SENSOR_SELECT_SQL. NUMERIC columns come back from Postgres as strings.
interface SensorRow {
    device_id: number;
    device_type: string;
    dev_eui: string;
    name: string;
    project_name: string;
    contact_first_name: string;
    contact_last_name: string;
    email: string;
    deployment_datetime: string;
    latitude: string | number;
    longitude: string | number;
    close_up_image_id: number | null;
    context_image_id: number | null;
    comments: { 
        datetime: string; 
        comment: string | null 
    }[];
}

// Shared SELECT; each function appends its own WHERE / ORDER BY.
const SENSOR_SELECT_SQL = `
    SELECT d.device_id,
        d.device_type,
        sm.dev_eui,
        sm.name,
        p.project_name,
        ph.contact_first_name,
        ph.contact_last_name,
        ph.email,
        ph.deployment_datetime,
        ph.latitude,
        ph.longitude,
        close_up.device_image_id AS close_up_image_id,
        context.device_image_id  AS context_image_id,
        COALESCE(c.comments, '[]'::JSON) AS comments -- returns an empty array if no comments
    FROM device d
    JOIN sensor_metadata sm ON sm.sensor_metadata_id = d.device_id

    -- current deployment
    JOIN LATERAL (
        SELECT *
            FROM project_history
        WHERE device_id = d.device_id
        ORDER BY deployment_datetime DESC
        LIMIT 1
    ) ph ON TRUE
    JOIN project p ON p.project_id = ph.project_id

    -- newest close-up and context images
    -- assumes the image_type text contains close_up or context => may need to change
    LEFT JOIN LATERAL (
        SELECT device_image_id
            FROM device_image
        WHERE device_id = d.device_id AND image_type = 'close_up'
        ORDER BY datetime DESC
        LIMIT 1
    ) close_up ON TRUE 
    LEFT JOIN LATERAL (
        SELECT device_image_id
            FROM device_image
        WHERE device_id = d.device_id AND image_type = 'context'
        ORDER BY datetime DESC
        LIMIT 1
    ) context ON TRUE

    -- all comments
    LEFT JOIN LATERAL (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT('datetime', dc.datetime, 'comment', dc.comment)
            ORDER BY dc.datetime
        ) AS comments
        FROM device_comment dc
        WHERE dc.device_id = d.device_id
    ) c ON TRUE
`;

// No params
export const ALL_SENSORS_SQL = `
    ${SENSOR_SELECT_SQL}
    ORDER BY sm.name;
`;

// $1 = dev_eui
export const SENSOR_BY_DEV_EUI_SQL = `
    ${SENSOR_SELECT_SQL}
    WHERE sm.dev_eui = $1;
`;

// $1 = longMin, $2 = longMax, $3 = latMin, $4 = latMax
export const SENSORS_IN_RANGE_SQL = `
    ${SENSOR_SELECT_SQL}
    WHERE ph.longitude BETWEEN $1 AND $2 AND ph.latitude  BETWEEN $3 AND $4
    ORDER BY sm.name;
`;

// TODO: replace with a call to the science-data-api once it exists.
function executeQuery<T>(sql: string, params: unknown[]): T[] {
    void sql;
    void params;
    return [];
}

function rowToMapSensor(row: SensorRow): MapSensor {
    const comments = row.comments.map(
        (c) => new SensorComment(new Date(c.datetime), c.comment ?? ""),
    );

    const history = new ProjectHistory(
        new Project(row.project_name),
        row.contact_first_name,
        row.contact_last_name,
        row.email,
        new Deployment(
            new Date(row.deployment_datetime),
            Number(row.longitude),
            Number(row.latitude),
        ),
    );

    // Only the latest reading is loaded for the map; it drives connection status.
    // A sensor with no readings gets an empty array and shows as offline.
    let sensorData: Data[] = [];
    try {
        sensorData = [getLatestData(row.dev_eui)];
    } catch {
        sensorData = [];
    }

    return new MapSensor(
        row.dev_eui,
        row.name,
        row.device_type,
        comments,
        row.close_up_image_id ?? -1,
        row.context_image_id ?? -1,
        history,
        sensorData,
    );
}

// Returns every sensor
export function getAllSensors(): MapSensor[] {
    // MOCK testing call
    if (USE_MOCK_SENSORS) {
        return mockSensors;
    }

    // Actual SQL science data call
    return executeQuery<SensorRow>(ALL_SENSORS_SQL, []).map(rowToMapSensor);
}

// Returns the sensor with the given devEUI, or throws if none exists.
export function getSensor(devEUI: string): MapSensor {
    // MOCK testing call
    if (USE_MOCK_SENSORS) {
        const sensor = mockSensors.find((s) => s.getDevEUI() === devEUI);
        if (!sensor) {
            throw new Error(`No mock sensor found with devEUI ${devEUI}`);
        }
        return sensor;
    }

    // Actual SQL science data call
    const rows = executeQuery<SensorRow>(SENSOR_BY_DEV_EUI_SQL, [devEUI]);

    if (rows.length === 0) {
        throw new Error(`No deployed sensor found with devEUI ${devEUI}`);
    }

    return rowToMapSensor(rows[0]);
}

// Returns sensors whose deployment coordinates fall inside the box (bounds inclusive).
export function getSensorsWithinRange(longMin: number, longMax: number, latMin: number, latMax: number): MapSensor[] {
    // MOCK testing call
    if (USE_MOCK_SENSORS) {
        return mockSensors.filter((s) => {
            const [longitude, latitude] = s.getSensorLocation();
            return longitude >= longMin && longitude <= longMax && latitude >= latMin && latitude <= latMax;
        });
    }

    // Actual SQL science data call
    return executeQuery<SensorRow>(SENSORS_IN_RANGE_SQL, [longMin, longMax, latMin, latMax]).map(rowToMapSensor);
}
