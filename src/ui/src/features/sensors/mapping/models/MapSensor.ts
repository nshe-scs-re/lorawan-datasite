// Author: Jacob

import { SensorInformation } from "../../sensor_information/models/SensorInformation";
import { SensorComment } from "../../sensor_information/models/SensorComment";
import { ProjectHistory } from "../../sensor_information/models/ProjectHistory";
import { Data } from "../../data/models/Data";

// Hours until sensor is considered "disconnected"
const maxHoursSinceLastData = 12;

export class MapSensor extends SensorInformation{
    connectionStatus:boolean = true;
    sensorData:Data[];

    constructor(devEUI: string, devName: string, deviceType: string, comments: SensorComment[], closeUpAssetId:number, contextAssetId:number, history: ProjectHistory, 
                sensorData: Data[]){
        super(devEUI, devName, deviceType, comments, closeUpAssetId, contextAssetId, history);
        this.sensorData = sensorData;
    }

    getConnectionStatus():boolean{
        const maxTimeSinceData = maxHoursSinceLastData*60*60*1000; // Currently 12 hours
        const latestData = this.sensorData.at(-1);

        if(!latestData){
            // No sensor data retrieved, assume it is offline
            this.connectionStatus = false;
            return false;
        }

        if(new Date().getTime() - latestData.getGatewayTime().getTime() > maxTimeSinceData){
            // Sensor has not received new data within the time period
            this.connectionStatus = false;
        }

        return this.connectionStatus;
    }

    getSensorData():Data[]{
        return this.sensorData;
    }

    getSensorDataAt(index:number):Data{
        return this.sensorData[index];
    }
    
    getSensorLocation():[number, number]{
        return this.projectHistory.getDeploymentCoords();
    }

    setConnectionStatus(newStatus:boolean){
        this.connectionStatus = newStatus;
    }

    setSensorData(newDataSet:Data[]){
        this.sensorData = newDataSet;
    }
}