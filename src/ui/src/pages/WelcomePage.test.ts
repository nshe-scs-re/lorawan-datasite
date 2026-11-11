import { expect, test } from "vitest";
import { renderWelcomePage } from "./WelcomePage.ts";

const pages = ["Welcome", "Device map", "About", "Log in", "Test", "Coming soon"];

test("renders the welcome content and navigation buttons", () => {
    const markup = renderWelcomePage(pages, true);

    expect(markup).toContain('<h1 id="welcome-title">LoRaWAN-TCC</h1>');
    expect(markup).toContain("Welcome to LoRaWAN-TCC!");
    expect(markup).toContain('data-page="Device map"');
    expect(markup).toContain("<span>02</span>Device map");
    expect(markup).not.toContain(" hidden>");
});

test("marks the welcome page hidden when it is inactive", () => {
    const markup = renderWelcomePage(pages, false);

    expect(markup).toContain('class="welcome-page"');
    expect(markup).toContain(" hidden>");
});

test("disables navigation buttons for pages that are not available", () => {
    const markup = renderWelcomePage(pages, true);

    expect(markup).toContain('<button type="button" data-page="Coming soon" disabled>');
    expect(markup).toContain("In Development");
    expect(markup).toContain('<button type="button" data-page="About" >');
});