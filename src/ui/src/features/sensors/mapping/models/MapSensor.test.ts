import {test, expect} from "vitest";
import { MapSensor } from "./MapSensor";
import { Project } from "../../sensor_information/models/Project";
import { Deployment } from "../../sensor_information/models/Deployment";
import { SoilMoistureData } from "../../data/models/SoilMoistureData";
import { AirTempData } from "../../data/models/AirTempData";
import { TiltData } from "../../data/models/TiltData";
import { ProjectHistory } from "../../sensor_information/models/ProjectHistory";
import { SensorComment } from "../../sensor_information/models/SensorComment";

const mockProject1 = new Project("Jacob's Home Test");
const mockProject2 = new Project("Gotta be a second project name here fs");
const defaultContactInfo = {contactFName: "Jacobo", contactLName: "comp", email: "email@getanemail.com"};

test("Sensor getLocation function returns 2, correctly stored, coordinates", () => {
    const sensor = new MapSensor(
        "0000000000000001",
        "Soil Sensor 1",
        "soil_moisture",
        [new SensorComment(
            new Date(),
            "This be a crazy new sensor"
        )],
        3,
        4,
        new ProjectHistory(
            mockProject1,
            defaultContactInfo.contactFName,
            defaultContactInfo.contactLName,
            defaultContactInfo.email,
            new Deployment(
                new Date(),
                -119.8138,
                39.5296
            )
        ),
        [new SoilMoistureData(
            new Date(),
            1,
            14,
            28.1,
            132
        )]
    );
    
    expect(sensor.getSensorLocation()).toEqual([-119.8138, 39.5296])
});

test("Overrides in data classes ensure no two sensors share the same color", () => {
    const sensor2 = new MapSensor(
        "0000000000000002",
        "Soil Sensor 2",
        "soil_moisture",
        [new SensorComment(
            new Date(),
            "comments on comments about commenting comments"
        )],
        3,
        4,
        new ProjectHistory(
            mockProject1,
            defaultContactInfo.contactFName,
            defaultContactInfo.contactLName,
            defaultContactInfo.email,
            new Deployment(
                new Date(),
                -119.8254,
                39.5421
            )
        ),
        [new SoilMoistureData(
            new Date(),
            1,
            17.2,
            32.4,
            146
        )]
    );
    
    const sensor3 = new MapSensor(
        "0000000000000003",
        "Air Temperature 1",
        "air_temperature",
        [new SensorComment(
            new Date(),
            "Dave was here lol"
        )],
        3,
        4,
        new ProjectHistory(
            mockProject2,
            defaultContactInfo.contactFName,
            defaultContactInfo.contactLName,
            defaultContactInfo.email,
            new Deployment(
                new Date(),
                -119.8015,
                39.5182
            )
        ),
        [new AirTempData(
            new Date(),
            1,
            22.6,
        )]
    );

    const sensor5 = new MapSensor(
        "0000000000000005",
        "Tilt Sensor 1",
        "tilt",
        [new SensorComment(
            new Date(),
            "Did not work well"
        )],
        3,
        4,
        new ProjectHistory(
            mockProject2,
            defaultContactInfo.contactFName,
            defaultContactInfo.contactLName,
            defaultContactInfo.email,
            new Deployment(
                new Date(),
                -119.7821,
                39.5743
            )
        ),
        [new TiltData(
            new Date(),
            2.3,
            -1.5,
        )]
    );

    const soilColor = sensor2.getSensorData().at(-1)?.getHexColor();
    const airColor = sensor3.getSensorData().at(-1)?.getHexColor();
    const tiltColor = sensor5.getSensorData().at(-1)?.getHexColor();

    // All should be defined
    expect(soilColor).toBeDefined();
    expect(airColor).toBeDefined();
    expect(tiltColor).toBeDefined();

    // All should be different
    expect(soilColor).not.toBe(airColor);
    expect(soilColor).not.toBe(tiltColor);
    expect(airColor).not.toBe(tiltColor);
});

test("Correctly retrieve the last measurement", () => {
    const sensor5 = new MapSensor(
        "0000000000000005",
        "Tilt Sensor 1",
        "tilt",
        [new SensorComment(
            new Date(),
            "Did not work well"
        )],
        3,
        4,
        new ProjectHistory(
            mockProject2,
            defaultContactInfo.contactFName,
            defaultContactInfo.contactLName,
            defaultContactInfo.email,
            new Deployment(
                new Date(),
                -119.7821,
                39.5743
            )
        ),
        [new TiltData(
            new Date(new Date().getTime() - 72*60*60*1000),
            2.3,
            -1.5,
        )]
    );

    const lastRollMeasurementData = sensor5.getSensorData().at(-1)?.getMeasurement("roll");
    const lastMeasurementData = sensor5.getSensorData().at(-1)?.getMeasurements();

    expect(lastRollMeasurementData).toEqual(2.3);
    expect(lastMeasurementData).toStrictEqual({
        roll: 2.3,
        pitch: -1.5
    });
});

test("Determine if sensor is active", () => {
    const sensor4 = new MapSensor(
        "0000000000000004",
        "Air Temperature 2",
        "air_temperature",
        [new SensorComment(
            new Date(),
            "Air was collected"
        )],
        3,
        4,
        new ProjectHistory(
            mockProject1,
            defaultContactInfo.contactFName,
            defaultContactInfo.contactLName,
            defaultContactInfo.email,
            new Deployment(
                new Date(),
                -119.8432,
                39.5561
            )
        ),
        [new AirTempData(
            new Date(),
            1,
            22.6,
        )]
    );
    
    const sensor5 = new MapSensor(
        "0000000000000005",
        "Tilt Sensor 1",
        "tilt",
        [new SensorComment(
            new Date(),
            "Did not work well"
        )],
        3,
        4,
        new ProjectHistory(
            mockProject2,
            defaultContactInfo.contactFName,
            defaultContactInfo.contactLName,
            defaultContactInfo.email,
            new Deployment(
                new Date(),
                -119.7821,
                39.5743
            )
        ),
        [new TiltData(
            new Date(new Date().getTime() - 72*60*60*1000),
            2.3,
            -1.5,
        )]
    );

    // Testing a true and false case
    expect(sensor4.getConnectionStatus()).toEqual(true);
    expect(sensor5.getConnectionStatus()).toEqual(false);
});

test("If no data is present, the sensor is considered disconnected", () => {
    const sensor5 = new MapSensor(
        "0000000000000005",
        "Tilt Sensor 1",
        "tilt",
        [new SensorComment(
            new Date(),
            "Did not work well"
        )],
        3,
        4,
        new ProjectHistory(
            mockProject2,
            defaultContactInfo.contactFName,
            defaultContactInfo.contactLName,
            defaultContactInfo.email,
            new Deployment(
                new Date(),
                -119.7821,
                39.5743
            )
        ),
        []
    );

    expect(sensor5.getConnectionStatus()).toEqual(false);
})