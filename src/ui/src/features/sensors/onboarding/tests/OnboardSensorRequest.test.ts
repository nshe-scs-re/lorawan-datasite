import {test, expect} from "vitest";

import { OnboardSensorRequest } from "../models/OnboardSensorRequest";
import { SensorComment } from "../../sensor_information/models/SensorComment";
import { ProjectHistory } from "../../sensor_information/models/ProjectHistory";
import { Project } from "../../sensor_information/models/Project";
import { Deployment } from "../../sensor_information/models/Deployment";

const mockProject1 = new Project("Jacob's Home Test");
const mockProject2 = new Project("Gotta be a second project name here fs");
const defaultContactInfo = {contactFName: "Jacobo", contactLName: "comp", email: "email@getanemail.com"};

test("Validation function in onboarding does not allow a small devEUI value", () => {
    expect(() => {
        const request = new OnboardSensorRequest(
            "11111111111",
            "Soil Moisture Test Sensor",
            "soil_moisture",
            [new SensorComment(
                new Date(),
                "Onboarding comment for testing"
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
            "12345678",
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            "111111",
            "111111",
            "SN12345678",
            "Dragino",
            "LSE01"
        );
    }).toThrow("Onboard object was instantiated with invalid fields");
});

test("Validation function in onboarding allows a valid request", () => {
    expect(() => {
        const request = new OnboardSensorRequest(
            "1111111111111111",
            "Soil Moisture Test Sensor",
            "soil_moisture",
            [new SensorComment(
                new Date(),
                "Onboarding comment for testing"
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
            "12345678",
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            "111111",
            "111111",
            "SN12345678",
            "Dragino",
            "LSE01"
        );
    }).not.toThrow();
});

test("Validation function in onboarding does not allow for a single empty string", () => {
    expect(() => {
        const request = new OnboardSensorRequest(
            "1111111111111111",
            "Soil Moisture Test Sensor",
            "soil_moisture",
            [new SensorComment(
                new Date(),
                "Onboarding comment for testing"
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
            "",
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            "",
            "111111",
            "111111",
            "SN12345678",
            "",
            "LSE01"
        );
    }).toThrow("Onboard object was instantiated with invalid fields");
});

test("ConvertToJson includes every field of the onboard request", () => {
    const dateTime = new Date();

    const request = new OnboardSensorRequest(
        "1111111111111111",
        "Soil Moisture Test Sensor",
        "soil_moisture",
        [
            new SensorComment(
                dateTime, 
                "Onboarding comment for testing"
            ),
            new SensorComment(
                dateTime, 
                "Second comment to show the array shape"
            ),
        ],
        3,
        4,
        new ProjectHistory(
            new Project("Jacob's Home Test"),
            "Nick",
            "Campbell",
            "email@getanemail.com",
            new Deployment(
                dateTime, 
                -119.8138, 39.5296
            )
        ),
        "12345678",
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
        "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        "111111",
        "222222",
        "SN12345678",
        "Dragino",
        "LSE01"
    );
    request.setRequestId(42);

    expect(JSON.parse(request.convertToJson())).toEqual({
        contactFName: "Nick",
        contactLName: "Campbell",
        email: "email@getanemail.com",
        devEUI: "1111111111111111",
        devAddr: "12345678",
        devNwsKey: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        devAppsKey: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
        appKey: "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        atPin: "111111",
        otaPin: "222222",
        serialNo: "SN12345678",
        devName: "Soil Moisture Test Sensor",
        deviceType: "soil_moisture",
        devMake: "Dragino",
        devModel: "LSE01",
        projectAssociation: "Jacob's Home Test",
        longitude: -119.8138,
        latitude: 39.5296,
        imageCloseUpAssetId: 3,
        imageContextAssetId: 4,
        deploymentDate: dateTime.toISOString(),
        comments: [
            {
                postedDate: dateTime.toISOString(),
                comment: "Onboarding comment for testing"
            },
            {
                postedDate: dateTime.toISOString(),
                comment: "Second comment to show the array shape"
            }
        ]
    });
});

test("Validation function in onboarding requires an email", () => {
    expect(() => {
        const request = new OnboardSensorRequest(
            "1111111111111111",
            "Soil Moisture Test Sensor",
            "soil_moisture",
            [new SensorComment(
                new Date(),
                "Onboarding comment for testing"
            )],
            3,
            4,
            new ProjectHistory(
                mockProject1,
                defaultContactInfo.contactFName,
                defaultContactInfo.contactLName,
                "",
                new Deployment(
                    new Date(),
                    -119.8138,
                    39.5296
                )
            ),
            "12345678",
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            "111111",
            "111111",
            "SN12345678",
            "Dragino",
            "LSE01"
        );
    }).toThrow("Onboard object was instantiated with invalid fields");
});