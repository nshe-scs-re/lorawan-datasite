// Author: Jacob Campau

import {test, expect} from "vitest";

import { OnboardSensorRequest } from "../onboarding/models/OnboardSensorRequest";
import { SensorComment } from "../sensor_information/models/SensorComment";
import { ProjectHistory } from "../sensor_information/models/ProjectHistory";
import { Project } from "../sensor_information/models/Project";
import { Deployment } from "../sensor_information/models/Deployment";

const mockProject1 = new Project("Jacob's Home Test");
const mockProject2 = new Project("Gotta be a second project name here fs");
const defaultContactInfo = {contactFName: "Jacobo", contactLName: "comp", email: "email@getanemail.com"};

test("Validation function in onboarding does not allow a small devEUI value", () => {
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

    expect(request.validateFields()).toEqual(false);
});

test("Validation function in onboarding allows a valid request", () => {
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

    expect(request.validateFields()).toEqual(true);
});

test("Validation function in onboarding does not allow for a single empty string", () => {
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

    expect(request.validateFields()).toEqual(false);
});

test("Validation function in onboarding requires an email", () => {
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

    expect(request.validateFields()).toEqual(false);
});