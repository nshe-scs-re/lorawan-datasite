// Author: Jacob

import { Data } from "./Data";

export class AirTempData extends Data{
    sensorInt:number;
    tempC:number;

    constructor(gatewayTime:Date, sensorInt:number, tempC:number){
        super(gatewayTime);
        this.sensorInt = sensorInt;
        this.tempC = tempC;
    }

    getSensorInt():number{
        return this.sensorInt;
    }

    getTempC():number{
        return this.tempC;
    }

    getMeasurements(): Record<string, number> {
        return{
            sensorInt: this.sensorInt,
            tempc: this.tempC,
        };
    }

    setSensorInt(newSensorInt:number){
        this.sensorInt = this.sensorInt;
    }

    setTempC(newTempC:number){
        this.tempC = newTempC;
    }
}