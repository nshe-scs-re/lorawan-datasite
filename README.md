This repo contains all related code for a senior project.

## UI draft

The `src/ui` folder contains the LoRaWAN-TCC welcome page and then empty pages inlcuding a temporary test page all in one app (rather than separate .ts files for each page). Use the navigation buttons to switch between those pages.

## View the UI locally

Install Node.js v22.23.4 (which includes npm), then from the repository root run:
`cd src/ui && npm ci && npm run dev`

Open the local address printed by Vite in terminal (usually http://localhost:5173) into your
browser to see the page. The dev server keeps running while viewing the UI, so, press `Ctrl+C` in the terminal to stop it.
