// Author: Jacob

export abstract class Data{
    gatewayTime:Date;
    hexColor:string = "#808080" //grey by default, overridden by children

    constructor(gatewayTime:Date){
        this.gatewayTime = gatewayTime;
    }

    getGatewayTime():Date{
        return this.gatewayTime;
    }
    
    getHexColor():string{
        return this.hexColor;
    };

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

    setHexColor(newColor:string){
        this.hexColor = newColor;
    }
}