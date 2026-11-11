export function renderWelcomePage(
    pages: string[],
    isActive: boolean,
): string {
    return `
        <section class="welcome-page" aria-labelledby="welcome-title" ${isActive ? "" : "hidden"}>
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
                    ${/* The app handles these with the same delegated navigation as the header. */
                    pages.slice(1).map((page, index) => {
                        const isAvailable = ["Welcome", "Device map", "About", "Log in", "Test"].includes(page);
                        return `<button type="button" data-page="${page}" ${isAvailable ? "" : "disabled"}><span>0${index + 2}</span>${page}<small>${isAvailable ? "Open page" : "In Development"}</small></button>`;
                    }).join("")}
                </div>
            </div>
        </section>
    `;
}