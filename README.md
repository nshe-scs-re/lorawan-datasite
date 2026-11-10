This repo contains all related code for a senior project.

## View the UI locally

Install Node.js v22.23.4 (which includes npm), then from the repository root run:
`cd src/ui && npm ci && npm run dev`

Open the local address printed by Vite in terminal (usually http://localhost:5173) into your browser to see the page. The dev server keeps running while viewing the UI, so, press `Ctrl+C` in the terminal to stop it.

To run the UI in Docker instead, use `sudo docker compose up --build` from the repository root, then open http://localhost:8080. Stop the containers with `Ctrl+C`.

## Run UI tests

The UI unit tests use Vitest. From the repository root, run all UI tests with:
`cd src/ui && npx vitest run`

To run a single page's tests, pass its test file path. For example:
`npx vitest run src/pages/WelcomePage.test.ts`
or
`npx vitest run src/pages/MapPage.test.ts`

To keep Vitest running and rerun tests as files change, use `npx vitest`.

## Web asset database tool

To make the addition of website assets easier when adding text, a javascript tool has been created. To run the rool, cd into the `db` folder and run the following: `npm run db:asset:tool`

This will open a menu with the following options:
1. Add new asset
        
    This option will allow you to fill out the needed fields for assets one by one. When filling in text used for the UI, make the file_path "assets/ui.txt" and the file_type "plain/text". These can be subject to change, but should be consistent. If you add a folder with images for the ui, make sure the file_path matches the file path of that ui image.

2. View all asset IDs

    This option will list all assets and their IDs in table form.

3. Edit asset by ID

    Using an ID obtained from option 2, you can edit any field of an asset. If you don't want to edit a part of the asset (i.e the title), just leave it blank.

4. View asset details by ID
        
    Using an ID obtained from option 2, you can view the fields of an asset. This option will allow you to view the created_at and updated_at datetime information.

5. Exit
        
    This option exits the tool and returns to the CLI. Additionally, you can use ctrl+c to close the tool at any time. If the process is inturupted mid asset edit or in the middle of adding a new asset, no changes or additions will be made.