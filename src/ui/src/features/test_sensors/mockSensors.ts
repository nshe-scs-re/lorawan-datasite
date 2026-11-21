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

// returns a date set the given number of hours before now
const hoursAgo = (hours:number):Date => new Date(new Date().getTime() - hours*60*60*1000);

// working sensor
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
        defaultContactInfo.contactFName,
        defaultContactInfo.contactLName,
        defaultContactInfo.email,
        new Deployment(
            new Date(),
            -119.8138,
            39.5296
        )
    ),
    [
        new SoilMoistureData(hoursAgo(6), 1, 12.8, 29.4, 136),
        new SoilMoistureData(hoursAgo(4), 1, 13.3, 28.9, 135),
        new SoilMoistureData(hoursAgo(2), 1, 13.7, 28.5, 133),
        new SoilMoistureData(
            new Date(),
            1,
            14,
            28.1,
            132
        )
    ]
);

// offline sensor
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
        // sets date to 3 days ago
        hoursAgo(72),
        1,
        17.2,
        32.4,
        146
    )]
)

// working sensor
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
    [
        new AirTempData(hoursAgo(6), 1, 18.4),
        new AirTempData(hoursAgo(4), 1, 20.1),
        new AirTempData(hoursAgo(2), 1, 21.7),
        new AirTempData(
            new Date(),
            1,
            22.6,
        )
    ]
);

// working sensor
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
    [
        new AirTempData(hoursAgo(6), 1, 19.2),
        new AirTempData(hoursAgo(4), 1, 20.8),
        new AirTempData(hoursAgo(2), 1, 22.0),
        new AirTempData(
            new Date(),
            1,
            22.6,
        )
    ]
);

// offline sensor
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
        // sets date to 3 days ago
        hoursAgo(72),
        2.3,
        -1.5,
    )]
);

// working sensor
const sensor6 = new MapSensor(
    "0000000000000006",
    "Tilt Sensor 2",
    "tilt",
    [new SensorComment(
        new Date(),
        "Holding steady on the slope"
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
            -119.7954,
            39.5612
        )
    ),
    [
        new TiltData(hoursAgo(6), 1.2, -0.8),
        new TiltData(hoursAgo(4), 1.3, -0.7),
        new TiltData(hoursAgo(2), 1.3, -0.9),
        new TiltData(new Date(), 1.4, -0.8)
    ]
);

export const mockSensors:MapSensor[] = [
    sensor1,
    sensor2,
    sensor3,
    sensor4,
    sensor5,
    sensor6
]