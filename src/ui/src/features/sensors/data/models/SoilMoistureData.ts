// Author: Jacob

import { Data } from "./Data";

export class SoilMoistureData extends Data{
    sensorInt:number;
    tempC:number;
    waterSatPerc:number;
    conductUscm:number;

    constructor(gatewayTime:Date, sensorInt:number, tempC:number,waterSatPerc:number, conductUscm:number){
        super(gatewayTime);
        this.sensorInt = sensorInt;
        this.tempC = tempC;
        this.waterSatPerc = waterSatPerc;
        this.conductUscm = conductUscm;
    }

    getSensorInt():number{
        return this.sensorInt;
    }

    getTempC():number{
        return this.tempC;
    }

    getWaterSatPerc():number{
        return this.waterSatPerc;
    }

    getConductUscm():number{
        return this.conductUscm;
    }

    getMeasurements():Record<string, number> {
        return{
            sensorInt: this.sensorInt,
            tempC: this.tempC,
            waterSatPerc: this.waterSatPerc,
            conductUscm: this.conductUscm,
        };
    }

    setSensorInt(newSensorInt:number){
        this.sensorInt = newSensorInt;
    }

    setTempC(newTempC:number){
        this.tempC = newTempC;
    }

    setWaterSatPerc(newWaterSatPerc:number){
        this.waterSatPerc = newWaterSatPerc;
    }

    setConductUscm(newConductUscm:number){
        this.conductUscm = newConductUscm;
    }
}