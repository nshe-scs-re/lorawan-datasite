export abstract class Data{
    gatewayTime:Date;

    constructor(gatewayTime:Date){
        this.gatewayTime = gatewayTime;
    }

    getGatewayTime():Date{
        return this.gatewayTime;
    }

    abstract getMeasurements():Record<string, number>;

    getMeasurement(type:string):number{
        const measurements = this.getMeasurements();
        if(!(type in measurements)){
            throw new Error(`Unknown Measurement Type: ${type}`);
        }
        return measurements[type];
    }

    setGatewayTime(newGatewayTime:Date){
        this.gatewayTime = newGatewayTime;
    }
}