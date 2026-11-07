import { Project } from "./Project"
import { SensorComment } from "./SensorComment"

export class SensorInformation{
    devEUI:string;
    devName:string;
    deviceType:string;
    comments:SensorComment[];
    imageAssetId:number;
    project: Project;

    constructor(devEUI:string, devName:string, deviceType:string, comments:SensorComment[], imageAssetId:number, project: Project){
        this.devEUI = devEUI;
        this.devName = devName;
        this.deviceType = deviceType;
        this.comments = comments;
        this.imageAssetId = imageAssetId;
        this.project = project;
    }

    getDevEUI():string{
        return this.devEUI;
    }

    getDevName():string{
        return this.devName;
    }

    getDeviceType():string{
        return this.deviceType;
    }

    getComments():SensorComment[]{
        return this.comments;
    }

    getImageAssetId():number{
        return this.imageAssetId;
    }

    getProject():Project{
        return this.project;
    }

    getDeviceCoords():number[]{
        return this.project.getDeploymentCoords();
    }

    setDevEUI(newDevEUI:string){
        this.devEUI = newDevEUI;
    }

    setDevName(newDevName:string){
        this.devName = newDevName;
    }

    setDeviceType(newDeviceType:string){
        this.deviceType = newDeviceType;
    }

    setComments(newComments:SensorComment[]){
        this.comments = newComments;
    }

    setImageAssetId(newImageAssetId:number){
        this.imageAssetId = newImageAssetId;
    }

    setProject(newProject:Project){
        this.project = newProject;
    }

    addComment(newComment:SensorComment){
        this.comments.push(newComment);
    }
}