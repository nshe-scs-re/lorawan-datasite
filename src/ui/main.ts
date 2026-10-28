import "./styles.css";

// Looks for the root element in HTML and throws error if not found.
const rootElement = document.querySelector<HTMLDivElement>("#app");
if (!rootElement) throw new Error("The UI root element #app is missing.");
const root: HTMLDivElement = rootElement;

// Shared page labels and menu state used to render the desktop and mobile menus.
const pages = ["Welcome", "Device map", "About", "Log in", "Test"];
const state = {
  menuOpen: false,
  activePage: "Welcome",
};

// Render the active page and navigation from the current UI state.
function render(): void {
  root.innerHTML = `<header class="site-header">
      <div class="brand-block">
        <span class="logo">logo here</span>
        <strong>LoRaWAN-TCC</strong>
      </div>
      <nav class="desktop-nav" aria-label="Page navigation">
        ${pages.map((page) => {
          const isAvailable = page === "Welcome" || page === "Device map" || page === "About" || page === "Log in" || page === "Test";
          const isCurrent = page === state.activePage;
          return `<button type="button" class="nav-button ${isCurrent ? "is-current" : ""}" data-page="${page}" ${isCurrent ? 'aria-current="page"' : ""} ${isAvailable ? "" : "disabled"}>${page}${isAvailable ? "" : "<small>soon</small>"}</button>`;
        }).join("")}
      </nav>
      <button class="menu-toggle" type="button" aria-label="Open page menu" aria-expanded="${state.menuOpen}">☰</button>
    </header>

    <nav class="mobile-menu ${state.menuOpen ? "is-open" : ""}" aria-label="Mobile page navigation">
      <div class="mobile-menu__top"><strong>LoRaWAN-TCC / pages</strong><button class="menu-close" type="button" aria-label="Close page menu">×</button></div>
      ${pages.map((page) => {
        const isAvailable = page === "Welcome" || page === "Device map" || page === "About" || page === "Log in" || page === "Test";
        const isCurrent = page === state.activePage;
        return `<button type="button" class="nav-button ${isCurrent ? "is-current" : ""}" data-page="${page}" ${isCurrent ? 'aria-current="page"' : ""} ${isAvailable ? "" : "disabled"}>${page}${isAvailable ? "" : "<small>soon</small>"}</button>`;
      }).join("")}
    </nav>

    <main>
      <section class="welcome-page" aria-labelledby="welcome-title" ${state.activePage === "Welcome" ? "" : "hidden"}>
        <div class="page-label"><span>PAGE 01</span><span>WELCOME</span></div>
        <div class="welcome">
          <p class="eyebrow">LoRaWAN DATA VISUALIZATION SITE</p>
          <h1 id="welcome-title">LoRaWAN-TCC</h1>
          <p class="intro">Welcome to LoRaWAN-TCC!</p>
          <p class="note">This site helps make LoRaWAN data accessible and understandable.</p>
        </div>
        <div class="section-placeholders" aria-label="Pages coming later">
          <p>PAGE NAVIGATION BUTTONS</p>
          <div class="page-buttons">
            ${pages.slice(1).map((page, index) => {
              const isAvailable = page === "Welcome" || page === "Device map" || page === "About" || page === "Log in" || page === "Test";
              return `<button type="button" data-page="${page}" ${isAvailable ? "" : "disabled"}><span>0${index + 2}</span>${page}<small>${isAvailable ? "Open page" : "In Development"}</small></button>`;
            }).join("")}
          </div>
        </div>
        <p class="welcome-footnote">Team 15 - Group name 404</p>
      </section>

      <section class="device-map-page" aria-labelledby="device-map-title" ${state.activePage === "Device map" ? "" : "hidden"}>
        <div class="page-label"><span>PAGE 02</span><span>DEVICE MAP</span></div>
        <div class="device-map">
          <p class="eyebrow">DEVICE MAP PAGE</p>
          <h1 id="device-map-title">Device map page</h1>
        </div>
      </section>

      <section class="about-page" aria-labelledby="about-title" ${state.activePage === "About" ? "" : "hidden"}>
        <div class="page-label"><span>PAGE 03</span><span>ABOUT</span></div>
        <div class="about">
          <p class="eyebrow">ABOUT PAGE</p>
          <h1 id="about-title">About page</h1>
        </div>
      </section>

      <section class="test-page" aria-labelledby="test-title" ${state.activePage === "Test" ? "" : "hidden"}>
        <div class="page-label"><span>PAGE 05</span><span>TEST</span></div>
        <div class="test">
          <p class="eyebrow">TEST PAGE</p>
          <h1 id="test-title">Test page</h1>
        </div>
      </section>
    </main>`;

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
}

// Render the welcome page immediately.
render();
