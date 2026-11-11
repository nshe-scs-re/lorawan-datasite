This repo contains all related code for a senior project.

## Have application stood up via Docker

Navigate to root of the project folder and run:
`docker compose up -d --build`

Having the application stood up via Docker allows for all components to run simultaneously without needing to have a terminal open for every single component. Application should be available via https://localhost:8080 after running the command. Site hosting to be tackled in the Spring.

If you run into a 502 Bad Gateway error, Nginx may be holding onto stale IP address. To fix, restart the nginx container:
`docker compose restart nginx`

## Run UI tests

The UI unit tests use Vitest. From the repository root, run all UI tests with:
`cd src/ui && npm run test`

To run a single page's tests, tag the page you want to test. For example:
`npm run test --WelcomePage`
or
`npm run test --MapPage`

To test a single sensor class, tag the class you want to test. For example:
`npm run test --MapSensor`
or
`npm run test --OnboardSensorRequest`

To keep Vitest running and rerun tests as files change, use `npm test:watch`.

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