import { mockSensors } from "../features/test_sensors/mockSensors";

mockSensors.forEach(sensor =>{
    // Longitude, latitude coords
    const coords = sensor.getSensorLocation();

    // Gets the hex color from the final (most recent) piece of data
    // If the sensor is no longer connected, then it will show as grey
    const sensorColor = sensor.getConnectionStatus() ? sensor.getSensorData()[-1].getHexColor() : "#808080";

    // Adding each sensor to a leaflet map
    // code to be added by Nick
})