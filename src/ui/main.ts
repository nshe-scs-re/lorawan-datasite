import "./styles.css";

// Looks for the root element in HTML and throws error if not found.
const rootElement = document.querySelector<HTMLDivElement>("#app");
if (!rootElement) throw new Error("The UI root element #app is missing.");
const root: HTMLDivElement = rootElement;

// Shared page labels and menu state used to render the desktop and mobile menus.
const pages = ["Welcome", "Device map", "Sensor details", "Downloads", "About", "Log in"];
const state = {
  menuOpen: false,
};

// Render the welcome page and navigation from the current menu state.
function render(): void {
  // Render the header, placeholder navigation, and welcome-page content.
  root.innerHTML = `<header class="site-header">
      <div class="brand-block">
        <span class="logo">logo here</span>
        <strong>LoRaWAN-TCC</strong>
      </div>
      <nav class="desktop-nav" aria-label="Page placeholders">
        ${pages.map((page, index) => `<button type="button" class="nav-button ${index === 0 ? "is-current" : ""}" ${index === 0 ? 'aria-current="page"' : "disabled"}>${page}${index ? `<small>soon</small>` : ""}</button>`).join("")}
      </nav>
      <button class="menu-toggle" type="button" aria-label="Open page menu" aria-expanded="${state.menuOpen}">☰</button>
    </header>

    <nav class="mobile-menu ${state.menuOpen ? "is-open" : ""}" aria-label="Mobile page placeholders">
      <div class="mobile-menu__top"><strong>LoRaWAN-TCC / pages</strong><button class="menu-close" type="button" aria-label="Close page menu">×</button></div>
      ${pages.map((page, index) => `<button type="button" class="nav-button ${index === 0 ? "is-current" : ""}" ${index === 0 ? 'aria-current="page"' : "disabled"}>${page}${index ? `<small>soon</small>` : ""}</button>`).join("")}
    </nav>

    <main>
      <section class="welcome-page" aria-labelledby="welcome-title">
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
            ${pages.slice(1).map((page, index) => `<button type="button" disabled><span>0${index + 2}</span>${page}<small>page later</small></button>`).join("")}
          </div>
        </div>
        <p class="draft-footnote">I'll add the other pages later but I need to know if this looks good lol.</p>
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
  root.querySelector(".mobile-menu .is-current")?.addEventListener("click", () => {
    state.menuOpen = false;
    render();
  });
}

// Render the complete welcome page immediately.
render();
