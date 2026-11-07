// Author: Jacob

import { Project } from "./Project";
import { ProjectHistory } from "./ProjectHistory";
import { SensorComment } from "./SensorComment"

export class SensorInformation{
    devEUI:string;
    devName:string;
    deviceType:string;
    comments:SensorComment[];
    imageCloseUpAssetId:number;
    imageContextAssetId:number;
    projectHistory: ProjectHistory;

    constructor(devEUI:string, devName:string, deviceType:string, comments:SensorComment[], imageCloseUpAssetId:number, imageContextAssetId:number, history: ProjectHistory){
        this.devEUI = devEUI;
        this.devName = devName;
        this.deviceType = deviceType;
        this.comments = comments;
        this.imageCloseUpAssetId = imageCloseUpAssetId;
        this.imageContextAssetId = imageContextAssetId;
        this.projectHistory = history;
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

    getImageCloseUpAssetId():number{
        return this.imageCloseUpAssetId;
    }

    getImageContextAssetId():number{
        return this.imageContextAssetId;
    }

    getProjectHistory():ProjectHistory{
        return this.projectHistory;
    }

    getDeviceCoords():[number, number]{
        return this.projectHistory.getDeploymentCoords();
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

    setImageCloseUpAssetId(newCloseUpAssetId:number){
        this.imageCloseUpAssetId = newCloseUpAssetId;
    }

    setImageContextAssetId(newContextAssetId:number){
        this.imageContextAssetId = newContextAssetId;
    }

    setProject(newHistory:ProjectHistory){
        this.projectHistory = newHistory;
    }

    addComment(newComment:SensorComment){
        this.comments.push(newComment);
    }
}