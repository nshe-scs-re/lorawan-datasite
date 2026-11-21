// Run from src/ui:
//   npx vitest run exportOnboardJson

import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "vitest";

import { OnboardSensorRequest } from "../models/OnboardSensorRequest";
import { SensorComment } from "../../sensor_information/models/SensorComment";
import { ProjectHistory } from "../../sensor_information/models/ProjectHistory";
import { Project } from "../../sensor_information/models/Project";
import { Deployment } from "../../sensor_information/models/Deployment";

test("export onboard request JSON", () => {
    const request = new OnboardSensorRequest(
        "1111111111111111",
        "Soil Moisture Test Sensor",
        "soil_moisture",
        [
            new SensorComment(
                new Date("2026-01-15T10:30:00.000Z"), 
                "Onboarding comment for testing"
            ),
            new SensorComment(
                new Date("2026-01-16T14:00:00.000Z"), 
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
                new Date("2026-01-10T08:00:00.000Z"), 
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

    // convertToJson() returns a compact string; re-indent it so it's readable for review.
    const pretty = JSON.stringify(JSON.parse(request.convertToJson()), null, 2);

    // Resolved relative to this file, so it lands in test_json no matter where vitest is run from.
    const outPath = resolve(dirname(fileURLToPath(import.meta.url)), "test_json", "onboard-request-sample.json");
    writeFileSync(outPath, pretty + "\n");
    console.log(`Wrote ${outPath}`);
});