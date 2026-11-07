// Author: Jacob

import { MapSensor } from "../sensors/mapping/models/MapSensor";
import { Project } from "../sensors/sensor_information/models/Project";
import { Deployment } from "../sensors/sensor_information/models/Deployment";
import { SoilMoistureData } from "../sensors/data/models/SoilMoistureData";
import { AirTempData } from "../sensors/data/models/AirTempData";
import { TiltData } from "../sensors/data/models/TiltData";
import { ProjectHistory } from "../sensors/sensor_information/models/ProjectHistory";
import { SensorComment } from "../sensors/sensor_information/models/SensorComment";

const mockProject1 = new Project("Jacob's Home Test");
const mockProject2 = new Project("Gotta be a second project name here fs");
const defaultContactInfo = {contactFName: "Jacobo", contactLName: "comp", email: "email@getanemail.com"};
const sensorTypeColors = {soil_moisture: "#88E788", air_temperature: "#FFD580", tilt: "#ADD8E6"};

const sensor1 = new MapSensor(
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
        "defaultContactInfo.contactFName",
        defaultContactInfo.contactLName,
        defaultContactInfo.email,
        new Deployment(
            new Date(),
            -119.8138,
            39.5296
        )
    ),
    true,
    sensorTypeColors.soil_moisture,
    [new SoilMoistureData(
        new Date(),
        1,
        14,
        28.1,
        132
    )]
);

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
        "defaultContactInfo.contactFName",
        defaultContactInfo.contactLName,
        defaultContactInfo.email,
        new Deployment(
            new Date(),
            -119.8254,
            39.5421
        )
    ),
    false,
    sensorTypeColors.soil_moisture,
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
        "defaultContactInfo.contactFName",
        defaultContactInfo.contactLName,
        defaultContactInfo.email,
        new Deployment(
            new Date(),
            -119.8015,
            39.5182
        )
    ),
    true,
    sensorTypeColors.air_temperature,
    [new AirTempData(
        new Date(),
        1,
        22.6,
    )]
);

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
        "defaultContactInfo.contactFName",
        defaultContactInfo.contactLName,
        defaultContactInfo.email,
        new Deployment(
            new Date(),
            -119.8432,
            39.5561
        )
    ),
    true,
    sensorTypeColors.air_temperature,
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
        "defaultContactInfo.contactFName",
        defaultContactInfo.contactLName,
        defaultContactInfo.email,
        new Deployment(
            new Date(),
            -119.7821,
            39.5743
        )
    ),
    false,
    sensorTypeColors.tilt,
    [new TiltData(
        new Date(),
        2.3,
        -1.5,
    )]
);

export const mockSensors:MapSensor[] = [
    sensor1,
    sensor2,
    sensor3,
    sensor4,
    sensor5
]