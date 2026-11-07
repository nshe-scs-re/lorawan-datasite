// Author: Jacob

export class Deployment{
    deploymentDate:Date
    longitude:number
    latitude:number

    constructor(deploymentDate:Date, longitude:number, latitude:number){
        this.deploymentDate = deploymentDate;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    getDeploymentDate():Date{
        return this.deploymentDate;
    }

    getLongitude():number{
        return this.longitude;
    }

    getLatitude():number{
        return this.latitude;
    }

    getCoordinates():[number, number]{
        return [this.longitude, this.latitude];
    }

    setDeploymentDate(newDate:Date){
        this.deploymentDate = newDate;
    }

    setLongitude(newLongitude:number){
        this.longitude = newLongitude;
    }

    setLatitude(newLatitude:number){
        this.latitude = newLatitude;
    }
}