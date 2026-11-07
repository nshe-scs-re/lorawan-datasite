import { Data } from "./Data";

export class TiltData extends Data{
    roll:number;
    pitch:number;

    constructor(gatewayTime:Date, roll:number, pitch:number){
        super(gatewayTime);
        this.roll = roll;
        this.pitch = pitch;
    }

    getRoll():number{
        return this.roll;
    }

    getPitch():number{
        return this.pitch;
    }

    getMeasurements(): Record<string, number> {
        return{
            roll: this.roll,
            pitch: this.pitch,
        };
    }

    setRoll(newRoll:number){
        this.roll = newRoll;
    }

    setPitch(newPitch:number){
        this.pitch = newPitch;
    }
}