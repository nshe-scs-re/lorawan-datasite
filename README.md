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
`npm run test -- WelcomePage`
or
`npm run test -- MapPage`

To test a single sensor class, tag the class you want to test. For example:
`npm run test -- MapSensor`
or
`npm run test -- OnboardSensorRequest`

To keep Vitest running and rerun tests as files change, use `npm test:watch`.

## Web asset database tool
### How to run
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

### Category and Tag information

All assets will have a category and tag. For this project, categories will associate with the pages while tags associate to the component the asset is used for. The list of categories is as follows:

- home
- map
- onboarding
- data
- technology
- about
- api
- global (This category is used for all things that are used globally around the project. For example, the project title and logo.)
- test

As stated previously, tags refer to the ui component the asset is used for. For example, all things used in the global header should have a "header" tag and be in the "global" category. Or if a the data page has an "information" component that has a title asset and data legend asset, the resulting assets would be as follows:

- `asset title: information_title, category: data, tag: information`
- `asset title: information_data_legend, category: data, tag: information`

These should be read as "the information_title and informaiton_data_legend assets are on the data page and in the information component"

## Sensor Image Defaults
There currently exists two images that exists as 'defaults' for the context and close up image on a sensor. The asset ids related to these are 3 for close up and 4 for context. They are stored in `src/ui/src/features/features/sensors/test_sensors/test_sensor_images`. If a sensor is loaded and the images cannot be pulled without error, these images should populate the needed image. 

## Service Files (The communication from backend to SCS-RE database)
There are three service files: `SensorService.ts`, `DataService.ts`, and `OnboardingService.ts`

These files are used to allow the frontend to communicate with the science data database of sensors. To allow for easy local testing, go to the `mockSensors.ts` file loced at `src/ui/src/features/sensors/test_sensors/mockSensors` and set `USE_MOCK_SENSORS` to true. This boolean controls whether local mock sensor information is pulled or if the science data is used. Setting the value to true means you want to use the local mock sensors and setting it to false means you want to use the science data database of sensors. 

Each service class has a list of functions meant to be used by the frontend. Their function names, uses, and parameters are explained below

### SensorService.ts
1. <b>getAllSensors()</b>

    This function returns all sensors from the SCS-RE database. This function's purpose is to map out all sensors listed within the database. Given that this list could be way more than is reasonable, another function allows you to obtain all sensors within a longitude and latitude range. If using mock sensor data, it will simply return all mock sensors that have been created. The return type for this function is MapSensor[] and contains MapSensor objects ready to be mapped.

2. <b>getSensor(devEui)</b>

    This function returns a MapSensor object with the corresponding device EUI passed as the parameter. This function's purpose is to be called when clicking into a sensor. When a used decides to view sensor data, this function should be called to ensure the most up-to-date information is called. This function sends a new sql query to the SCS-RE database to ensure the data about the sensor is accurate. For mock sensors, it works the exact same way except it pulls from the created mock sensors.

3. <b>getSensorsWithinRange(longMin, longMax, latMin, latMax)</b>

    This is the previously mentioned function that returns the sensors within a square region. Using this function, the SQL query used in getAllSensors appends another WHERE statement to ensure the latitude and longitude values fall within that range. This should be used in conjunction with leafpad so that the only sensors displayed are the ones that can be seen.

### DataService.ts
1. <b>getLatestData(devEui)</b>

    This function takes in a device's EUI and returns the latest data for that sensor. This function should mainly be called by the following function, but is available to call if needed. Ideally, it should not since the following function does the same, but applies it to all sensors on the map.

2. <b>getLatestDataForAll(MapSensor[])</b>

    This function takes in the array of MapSensor objects that the frontend is tracking. Upon calling this function, all mapped sensors have their most recent data initialized. This is needed for the MapSensor objects since the SensorService does not return any data with the Sensors it returns. This function should be called immediately after getting an array of MapSensors either from the `getAllSensors()` function or with the `getSensorsWithinRange()` function. This function does not return anything, it instead only updates the past MapSensor objects.

3. <b>getDataInDateRange(devEui, mindDate, maxDate)</b>

    As the function name implies, this function returns an array of Data objects for a sensor within a date range. The function takes the device EUI, the minimum date, and maximum date. This function should be called when graphing points on the graph. Since the user should be able to define the range of data they view, this function will allow for that graph to not just be static. 

### OnboardingService.ts
1. <b>submitRequest(OnboardSensorRequest)</b>

    This function calls the Go API layer to add the request to our onboard request database. The function uses two SQL commands. One for the initial request that returns the request id and then a second to use that request id to add all onboard request details. This function will add the onboard request to the db with all needed fields with the initial pending status of 0. 

2. <b>updateRequestStatus(requestId, statusValue)</b>

    This function will be the function used to either approve or deny a sensor. It can be used to also send a sensor back to being pending, but its main use will be approval (1) or denial (2). The function will be called depending on the slack response after the initial slack message is sent by the GO api layer. Depending on implementation, this function, and the following one, may need to get moved to that api layer. The function contains the one SQL command needed to update the status based on the passed request Id.

3. <b>registerSensor(requestId)</b>

    This function takes the passed request ID and submits it to the SCS-RE database. The function contains two SQL commands. The first finds and retrieves all onboard data based on the request id. The second takes that information and fills a new entry in every needed table on the SCS-RE database. This second SQL command must be reviewed by SCS-RE before we ever use it. Again, this function may need to instead live in the Go api layer instead.