import "./header.css";

export function renderHeader(
    pages: string[], 
    activePage: string, 
    menuOpen: boolean,
): string {
    // Reuse the same button markup for desktop and mobile navigation.
    const pageButton = (page: string) => {
        const isCurrent = page === activePage;

        return `<button 
            type="button" 
            class="nav-button ${isCurrent ? "is-current" : ""}" 
            data-page="${page}"
            ${isCurrent ? 'aria-current="page"' : ""}
        >${page}</button>`;
    };

    return `
        <header class="site-header">
            <div class="brand-block">
                <span class="logo">logo here</span>
                <strong class="site-title"></strong>
                <span class="active-page">/ ${activePage}</span>
            </div>
            <nav class="desktop-nav" aria-label="Page navigation">${pages.map(pageButton).join("")}</nav>
            <button class="menu-toggle" type="button" aria-label="Open page menu" aria-expanded="${menuOpen}">☰</button>
        </header>

        <nav class="mobile-menu ${menuOpen ? "is-open" : ""}" aria-label="Mobile page navigation">
            <div class="mobile-menu__top">
                <div class="brand-block">
                    <strong class="site-title"></strong>
                    <span class="active-page">/ ${activePage}</span>
                </div>
                <button class="menu-close" type="button" aria-label="Close page menu">×</button>
            </div>
            ${pages.map(pageButton).join("")}
        </nav>
    `;
}
