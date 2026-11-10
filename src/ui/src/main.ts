//Author: Nick Campbell

import "./styles.css";
import { renderHeader } from "./components/header.ts";
import { destroyMap, initializeMap, renderMapPage } from "./pages/MapPage.ts";
import { renderAboutPage } from "./pages/AboutPage.ts";
import { renderWelcomePage } from "./pages/WelcomePage.ts";
import { renderFooter } from "./components/footer.ts";

// Looks for the root element in HTML and throws error if not found.
const rootElement = document.querySelector<HTMLDivElement>("#app");
if (!rootElement) throw new Error("The UI root element #app is missing.");
const root: HTMLDivElement = rootElement;

// Shared page labels and menu state used to render ui.
const pages = ["Welcome", "Device map", "About", "Log in", "Test"];
const state = {
  menuOpen: false,
  activePage: "Welcome",
  siteTitle: "Loading...",
  selectedSensorId: null as number | null,
};

//Edit: Jacob Campau
interface Asset {
    asset_id: number;
    title: string;
    description: string | null;
    file_path: string;
    file_type: string;
}

//Edit: Jacob Campau
async function loadAsset(): Promise<void> {
    const titleElement =
        root.querySelector<HTMLHeadingElement>("#asset-title");

    const descriptionElement =
        root.querySelector<HTMLTextAreaElement>("#asset-description");

    const statusElement =
        root.querySelector<HTMLParagraphElement>("#asset-status");

    if (!titleElement || !descriptionElement || !statusElement) {
        return;
    }

    try {
        const response = await fetch("/api/assets/1");

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const asset: Asset = await response.json();

        titleElement.textContent = asset.title;
        descriptionElement.value = asset.description ?? "";

        statusElement.textContent = "Asset loaded successfully.";
    } catch (error) {
        console.error("Failed to load asset:", error);

        titleElement.textContent = "Unable to load asset";
        statusElement.textContent =
            "Could not retrieve the asset from the API.";
    }
}

//Is this fr what I have to do for every single asset I need to load??
async function fetchSiteTitle(): Promise<void> {
  const response = await fetch("/api/assets/5"); //I would change out the ids and just use unique names like /api/site-title.
  if (!response.ok) {
    throw new Error(`Failed to fetch site title: ${response.status}`);
  }

  const asset: Asset = await response.json();
  state.siteTitle = asset.title;
  // Rendering again updates both header versions with the fetched title.
  render();
}

// Render the active page and navigation from the current UI state.
function render(): void {
    // Leaflet needs its old map removed before the page markup replaces its container.
    destroyMap();
    root.innerHTML = `${renderHeader(pages, state.activePage, state.menuOpen)}

    <main>
      ${renderWelcomePage(pages, state.activePage === "Welcome")}

      ${renderMapPage(state.activePage === "Device map")}

      ${renderAboutPage(state.activePage === "About")}

      <section class="test-page" aria-labelledby="test-title" ${state.activePage === "Test" ? "" : "hidden"}>
        <div class="page-label">
          <span>PAGE 05</span>
          <span>TEST</span>
        </div>

        <div class="test">
          <p class="eyebrow">TEST PAGE</p>
          <h1 id="test-title">Test page</h1>

          <div class="asset-container">
            <div class="asset-header">
              <h2 id="asset-title">Loading asset...</h2>
              <span class="asset-badge">DATABASE RECORD</span>
            </div>

          <div class="asset-field">
            <label for="asset-description">
              Asset Description
            </label>

            <textarea
              id="asset-description"
              rows="5"
              readonly
              placeholder="Asset description will appear here..."
            ></textarea>
          </div>

          <p id="asset-status" class="asset-status"></p>
        </div>
        </div>
      </section>
    </main>

    ${renderFooter()}`;

  if (state.activePage === "Device map") {
    initializeMap();
  }

  // Loads in site title from web asset API
  // ALL OTHER API CALLS WILL BE LATER THIS IS JUST A PROOF OF CONCEPT
  root.querySelectorAll<HTMLElement>(".site-title").forEach((element) => {
    element.textContent = state.siteTitle;
  });

  // Keep the mobile menu's open/close controls in sync with state by re-rendering.
  root.querySelector(".menu-toggle")?.addEventListener("click", () => {
    state.menuOpen = true;
    render();
  });
  root.querySelector(".menu-close")?.addEventListener("click", () => {
    state.menuOpen = false;
    render();
  });
  root.querySelectorAll<HTMLButtonElement>(".nav-button:not(:disabled), .page-buttons button:not(:disabled)").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePage = button.dataset.page ?? "Welcome";
      state.menuOpen = false;
      render();
    });
  });

  if (state.activePage === "Test") {
      console.log("Test page is active. Calling loadAsset()");
    loadAsset();
}
}

// Render the welcome page immediately.
render();
void fetchSiteTitle().catch((error) => {
  console.error("Failed to fetch site title:", error);
});
