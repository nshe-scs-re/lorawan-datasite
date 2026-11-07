import { SensorInformation } from "../../sensor_information/models/SensorInformation";
import { SensorComment } from "../../sensor_information/models/SensorComment";
import { Project } from "../../sensor_information/models/Project";
import { Data } from "../../data/models/Data";

export class MapSensor extends SensorInformation{
    connectionStatus:boolean;
    hexColor:string;
    sensorData:Data[];

    constructor(devEUI: string, devName: string, deviceType: string, comments: SensorComment[], imageAssetId:number, project: Project, connectionStatus: boolean, hexColor: string, sensorData: Data[]){
        super(devEUI, devName, deviceType, comments, imageAssetId, project);
        this.connectionStatus = connectionStatus;
        this.hexColor = hexColor;
        this.sensorData = sensorData;
    }

    getConnectionStatus():boolean{
        return this.connectionStatus;
    }

    getHexColor():string{
        return this.hexColor;
    }

    getSensorData():Data[]{
        return this.sensorData;
    }

    getSensorDataAt(index:number):Data{
        return this.sensorData[index];
    }
    
    getSensorLocation():[number, number]{
        return this.project.getDeploymentCoords();
    }

    setConnectionStatus(newStatus:boolean){
        this.connectionStatus = newStatus;
    }

    setHexColor(newColor:string){
        this.hexColor = newColor;
    }

    setSensorData(newDataSet:Data[]){
        this.sensorData = newDataSet;
    }
}