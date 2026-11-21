import { Data } from "../models/Data";
import { SoilMoistureData } from "../models/SoilMoistureData";
import { AirTempData } from "../models/AirTempData";
import { TiltData } from "../models/TiltData";
import { mockSensors, USE_MOCK_SENSORS } from "../../../test_sensors/mockSensors";
import type { MapSensor } from "../../mapping/models/MapSensor";

type DataType = "soil_moisture" | "air_temperature" | "tilt";

// One row of SENSOR_DATA_SQL. Columns that don't apply to a data_type are NULL.
// NUMERIC columns come back from Postgres as strings, hence string | number.
interface SensorDataRow {
    data_type: DataType;
    gateway_time: string;
    sensor_int: number | null;
    temp_c: string | number | null;
    soil_water_sat_perc: string | number | null;
    soil_conduct_uscm: string | number | null;
    roll: string | number | null;
    pitch: string | number | null;
}

// Every reading for a sensor, normalised across the three data tables.
// $1 = dev_eui
const SENSOR_DATA_SQL = `
    SELECT 'soil_moisture' AS data_type,
        sm.gateway_time,
        sm.sensor_int,
        sm.soil_temp_c         AS temp_c,
        sm.soil_water_sat_perc,
        sm.soil_conduct_uscm,
        NULL::NUMERIC          AS roll,
        NULL::NUMERIC          AS pitch
    FROM soil_moisture sm
    WHERE sm.dev_eui = $1

    UNION ALL

    SELECT 'air_temperature' AS data_type,
        at.gateway_time,
        at.sensor_int,
        at.temp_c,
        NULL::NUMERIC,
        NULL::NUMERIC,
        NULL::NUMERIC,
        NULL::NUMERIC
    FROM air_temperature at
    WHERE at.dev_eui = $1

    UNION ALL

    SELECT 'tilt' AS data_type,
        t.gateway_time,
        NULL::SMALLINT,
        NULL::NUMERIC,
        NULL::NUMERIC,
        NULL::NUMERIC,
        t.roll,
        t.pitch
    FROM tilt t
    WHERE t.dev_eui = $1
`;

// Most recent reading for a sensor.
// $1 = dev_eui
export const LATEST_DATA_SQL = `
    SELECT *
    FROM (${SENSOR_DATA_SQL}) data
    ORDER BY data.gateway_time DESC
    LIMIT 1;
`;

// All readings for a sensor within [minDate, maxDate], oldest first
// (MapSensor expects sensorData.at(-1) to be the latest reading).
// $1 = dev_eui, $2 = minDate, $3 = maxDate
export const DATA_IN_RANGE_SQL = `
    SELECT *
    FROM (${SENSOR_DATA_SQL}) data
    WHERE data.gateway_time BETWEEN $2 AND $3
    ORDER BY data.gateway_time ASC;
`;

// !!!!Replace with a call to the science-data-api once it exists!!!!
function executeQuery<T>(sql: string, params: unknown[]): T[] {
    void sql;
    void params;
    return [];
}

// Convert the returned generalized row data into a specific data type object
function rowToData(row: SensorDataRow): Data {
    const gatewayTime = new Date(row.gateway_time);

    switch (row.data_type) {
        case "soil_moisture":
            return new SoilMoistureData(
                gatewayTime,
                Number(row.sensor_int),
                Number(row.temp_c),
                Number(row.soil_water_sat_perc),
                Number(row.soil_conduct_uscm),
            );
        case "air_temperature":
            return new AirTempData(
                gatewayTime, 
                Number(row.sensor_int), 
                Number(row.temp_c)
            );
        case "tilt":
            return new TiltData(
                gatewayTime, 
                Number(row.roll), 
                Number(row.pitch)
            );
        default:
            throw new Error(`Sensor data type is not supported ${row.data_type}`);
    }
}

// Returns the most recent reading for a sensor, or throws if it has none.
export function getLatestData(devEUI: string): Data {
    // MOCK testing call
    if (USE_MOCK_SENSORS) {
        const sensor = mockSensors.find((s) => s.getDevEUI() === devEUI);
        if (!sensor) {
            throw new Error(`No mock sensor found with devEUI ${devEUI}`);
        }

        const latest = sensor.getSensorData().at(-1);
        if (!latest) {
            throw new Error(`No data found for sensor ${devEUI}`);
        }
        
        return latest;
    }

    // Actual SQL science data call
    const rows = executeQuery<SensorDataRow>(LATEST_DATA_SQL, [devEUI]);

    if (rows.length === 0) {
        throw new Error(`No data found for sensor ${devEUI}`);
    }

    return rowToData(rows[0]);
}

// Fetches the most recent reading for each sensor and adds it to that sensor's data array.
// Sensors with no readings are left unchanged.
export function getLatestDataForAll(sensors: MapSensor[]): void {
    for (const sensor of sensors) {
        try {
            const latest = getLatestData(sensor.getDevEUI())
            const data = sensor.getSensorData();
            const current = data.at(-1);

            // If the current data is the most recent, dont waste time filling it again
            if (current && current.getGatewayTime().getTime() >= latest.getGatewayTime().getTime()) {
                return;
            }

            sensor.setSensorData([...data, latest]);
        } catch {
            // No data (or unknown devEUI) for this sensor; leave its data array as is
        }
    }
}

// Returns a sensor's readings between minDate and maxDate (inclusive), oldest first.
export function getDataInDateRange(devEUI: string, minDate: Date, maxDate: Date): Data[] {
    // MOCK testing call
    if (USE_MOCK_SENSORS) {
        const sensor = mockSensors.find((s) => s.getDevEUI() === devEUI);
        if (!sensor) {
            throw new Error(`No mock sensor found with devEUI ${devEUI}`);
        }

        return sensor.getSensorData().filter((d) => {
                const t = d.getGatewayTime().getTime();
                return t >= minDate.getTime() && t <= maxDate.getTime();
            }).sort((a, b) => 
                a.getGatewayTime().getTime() - b.getGatewayTime().getTime()
            );
    }

    // Actual SQL science data call
    const rows = executeQuery<SensorDataRow>(DATA_IN_RANGE_SQL, [
        devEUI,
        minDate.toISOString(),
        maxDate.toISOString(),
    ]);

    return rows.map(rowToData);
}
