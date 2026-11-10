//Author: Nick Campbell

import * as L from "leaflet";
import { mockSensors } from "../features/test_sensors/mockSensors";
import "leaflet/dist/leaflet.css";

let map: L.Map | undefined;

function createSensorPopup(sensor: (typeof mockSensors)[number]): HTMLElement {
    const popup = document.createElement("div");
    popup.className = "sensor-popup";

    const title = document.createElement("h2");
    title.textContent = sensor.getDevName();
    popup.append(title);

    const deviceType = document.createElement("p");
    deviceType.textContent = `Type: ${sensor.getDeviceType()}`;
    popup.append(deviceType);

    const isConnected = sensor.getConnectionStatus();
    const status = document.createElement("p");
    status.textContent = `Status: ${isConnected ? "Connected" : "Offline"}`;
    popup.append(status);

    const comments = sensor.getComments();
    const commentsSection = document.createElement("section");
    const commentsHeading = document.createElement("h3");
    commentsHeading.textContent = "Comments";
    commentsSection.append(commentsHeading);

    if (comments.length > 0) {
        const commentList = document.createElement("ul");
        for (const comment of comments) {
            const item = document.createElement("li");
            const text = document.createElement("p");
            text.textContent = comment.getComment();
            item.append(text);

            const postedDate = document.createElement("time");
            const date = comment.getPostedDate();
            postedDate.dateTime = date.toISOString();
            postedDate.textContent = new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
            }).format(date);
            item.append(postedDate);
            commentList.append(item);
        }
        commentsSection.append(commentList);
    } else {
        const noComments = document.createElement("p");
        noComments.textContent = "No comments yet.";
        commentsSection.append(noComments);
    }
    popup.append(commentsSection);

    const latestData = sensor.getSensorData().at(-1);
    if (latestData) {
        const measurements = document.createElement("ul");
        for (const [name, value] of Object.entries(latestData.getMeasurements())) {
            const measurement = document.createElement("li");
            const label = name.replace(/([a-z])([A-Z])/g, "$1 $2");
            measurement.textContent = `${label}: ${new Intl.NumberFormat(undefined, {
                maximumFractionDigits: 2,
            }).format(value)}`;
            measurements.append(measurement);
        }
        popup.append(measurements);

        const timestamp = document.createElement("p");
        timestamp.textContent = `Last reading: ${new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(latestData.getGatewayTime())}`;
        popup.append(timestamp);
    } else {
        const noData = document.createElement("p");
        noData.textContent = "No readings available.";
        popup.append(noData);
    }

    return popup;
}

export function renderMapPage(isActive: boolean): string {
    return `
        <section class="device-map-page" aria-labelledby="device-map-title" ${isActive ? "" : "hidden"}>
            <div class="page-label"><span>PAGE 02</span><span>DEVICE MAP</span></div>
            <div class="map-heading">
                <h1 id="device-map-title">Device map</h1>
                <p><span class="offline-map-key" aria-hidden="true"></span> Marker color shows the latest reading; gray means offline.</p>
            </div>
            <div class="device-map" id="sensor-map" role="region" aria-label="Interactive map of deployed sensors"></div>
        </section>
    `;
}

export function initializeMap(): void {
    const container = document.getElementById("sensor-map");
    if (!container) {
        throw new Error("The sensor map container is missing.");
    }

    // Remove any previous Leaflet instance before attaching a map to the rendered container.
    destroyMap();
    const activeMap = L.map(container).setView([39.53, -119.82], 12);
    map = activeMap;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(activeMap);

    const sensorLocations: L.LatLng[] = [];

    mockSensors.forEach((sensor) => {
        // Sensor locations are stored as [longitude, latitude]; Leaflet uses [latitude, longitude].
        const [longitude, latitude] = sensor.getSensorLocation();
        const location = L.latLng(latitude, longitude);
        const latestData = sensor.getSensorData().at(-1);
        const isConnected = sensor.getConnectionStatus();
        // Offline sensors are gray; connected sensors use the latest reading's color.
        const sensorColor = isConnected && latestData
            ? latestData.getHexColor()
            : "#808080";

        const tooltip = document.createElement("span");
        tooltip.textContent = sensor.getDevName();

        L.circleMarker(location, {
            radius: 9,
            color: "#ffffff",
            weight: 2,
            fillColor: sensorColor,
            fillOpacity: 0.9,
        })
            .bindPopup(createSensorPopup(sensor))
            .bindTooltip(tooltip)
            .addTo(activeMap);

        sensorLocations.push(location);
    });

    // Frame the map around all sensors, using a close view when there is only one.
    if (sensorLocations.length === 1) {
        activeMap.setView(sensorLocations[0], 14);
    } else if (sensorLocations.length > 1) {
        activeMap.fitBounds(L.latLngBounds(sensorLocations).pad(0.2), { maxZoom: 14 });
    }

    // Recalculate the map dimensions after it is rendered into the active page.
    activeMap.invalidateSize();
}

export function destroyMap(): void {
    // Leaflet binds event handlers to the container, so remove its instance on page changes.
    map?.remove();
    map = undefined;
}
