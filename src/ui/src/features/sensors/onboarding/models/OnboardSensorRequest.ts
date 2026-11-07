// Author: Jacob

import { SensorInformation } from '../../sensor_information/models/SensorInformation';
import { SensorComment } from '../../sensor_information/models/SensorComment';
import { ProjectHistory } from '../../sensor_information/models/ProjectHistory';

export class OnboardSensorRequest extends SensorInformation {
    requestId:number = -1; // Set to -1 as default. Set based on db request id
    devAddr:string;
    devNwsKey:string;
    devAppsKey:string;
    appKey:string;
    atPin:string;
    otaPin:string;
    serialNo:string;
    devMake:string;
    devModel:string;
  
    constructor(devEUI:string, devName:string, deviceType:string, comments:SensorComment[], closeUpAssetId:number, contextAssetId:number, history:ProjectHistory,
                devAddr:string, devNwsKey:string, devAppsKey:string, appKey:string, atPin:string, otaPin:string, serialNo:string, devMake:string, devModel:string){
        super(devEUI, devName, deviceType, comments, closeUpAssetId, contextAssetId, history);
        this.devAddr = devAddr;
        this.devNwsKey = devNwsKey;
        this.devAppsKey = devAppsKey;
        this.appKey = appKey;
        this.atPin = atPin;
        this.otaPin = otaPin;
        this.serialNo = serialNo;
        this.devMake = devMake;
        this.devModel = devModel;

        const validFields = this.validateFields();
        if(!validFields){
            throw new Error("Onboard object was instantiated with invalid fields");
        }
    }

    getRequestId():number{
        return this.requestId;
    }

    getDevAddr():string{
        return this.devAddr;
    }

    getDevNwsKey():string{
        return this.devNwsKey;
    }

    getDevAppsKey():string{
        return this.devAppsKey;
    }

    getAppKey():string{
        return this.appKey;
    }

    getAtPin():string{
        return this.atPin;
    }

    getOtaPin():string{
        return this.otaPin;
    }

    getSerialNo():string{
        return this.serialNo;
    }

    getDevMake():string{
        return this.devMake;
    }

    getDevModel():string{
        return this.devModel;
    }

    setRequestId(newRequestId:number){
        this.requestId = newRequestId;
    }

    setDevAddr(newDevAddr:string){
        this.devAddr = newDevAddr;
    }

    setDevNwsKey(newDevNwsKey:string){
        this.devNwsKey = newDevNwsKey;
    }

    setDevAppsKey(newDevAppsKey:string){
        this.devAppsKey = newDevAppsKey;
    }

    setAppKey(newAppKey:string){
        this.appKey = newAppKey;
    }

    setAtPin(newAtPin:string){
        this.atPin = newAtPin;
    }

    setOtaPin(newOtaPin:string){
        this.otaPin = newOtaPin;
    }

    setSerialNo(newSerialNo:string){
        this.serialNo = newSerialNo;
    }

    setDevMake(newDevMake:string){
        this.devMake = newDevMake;
    }

    setDevModel(newDevModel:string){
        this.devModel = newDevModel;
    }

    validateFields():boolean {
        // All fields needed for the request in the erd
        const required = [
        this.devEUI, this.devName, this.deviceType, this.devAddr,
        this.devNwsKey, this.devAppsKey, this.appKey,
        this.atPin, this.otaPin, this.serialNo, this.devMake, this.devModel,
        this.projectHistory.getProject().title, this.projectHistory.contactFName,
        this.projectHistory.contactLName, this.projectHistory.email,
        ];

        // Requirements as listed by the erd for SCS-RE database
        if (!required.every(value => value.trim().length > 0)) return false;
        if (!/^[0-9a-fA-F]{16}$/.test(this.devEUI)) return false;
        if (!/^[0-9a-fA-F]{8}$/.test(this.devAddr)) return false;
        if (![this.devNwsKey, this.devAppsKey, this.appKey].every(value => /^[0-9a-fA-F]{32}$/.test(value))) return false;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.projectHistory.email)) return false;

        // So long as no previous checks fired, we are good
        return true;
    }
}