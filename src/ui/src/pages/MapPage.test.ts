import { expect, test, vi } from "vitest";

vi.mock("leaflet", () => ({
    circleMarker: vi.fn(),
    latLng: vi.fn(),
    latLngBounds: vi.fn(),
    map: vi.fn(),
    tileLayer: vi.fn(),
}));

import { renderMapPage } from "./MapPage.ts";

test("renders the map page and its accessible map region", () => {
    const markup = renderMapPage(true);

    expect(markup).toContain('aria-labelledby="device-map-title"');
    expect(markup).toContain("<h1 id=\"device-map-title\">Device map</h1>");
    expect(markup).toContain('id="sensor-map"');
    expect(markup).toContain('aria-label="Interactive map of deployed sensors"');
    expect(markup).not.toContain(" hidden>");
});

test("hides the map page when it is inactive", () => {
    const markup = renderMapPage(false);

    expect(markup).toContain('class="device-map-page"');
    expect(markup).toContain('id="sensor-map"');
    expect(markup).toContain(" hidden>");
});
