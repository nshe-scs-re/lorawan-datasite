import { mockSensors } from "../features/test_sensors/mockSensors";

mockSensors.forEach(sensor =>{
    // Longitude, latitude coords
    const coords = sensor.getSensorLocation();

    // Adding each sensor to a leaflet map
    // code to be added by Nick
})