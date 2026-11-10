//Author: Nick Campbell

export function renderAboutPage(isActive: boolean): string {
    return `
    <section class="about-page" aria-labelledby="about-title" ${isActive ? "" : "hidden"}>
        <div class="page-label"><span>PAGE 03</span><span>ABOUT</span></div>
        <div class="about">
            <p class="eyebrow">ABOUT PAGE</p>
            <h1 id="about-title">About page</h1>
        </div>
    </section>
    `;
}