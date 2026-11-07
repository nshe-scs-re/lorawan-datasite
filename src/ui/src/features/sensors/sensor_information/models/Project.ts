import { Deployment } from "./Deployment"

export class Project{
    title: string;
    contactFName: string;
    contactLName: string;
    email: string;
    deploymentInfo: Deployment;

    constructor(title: string, contactFName: string, contactLName: string, email: string, deploymentInfo: Deployment){
        this.title = title;
        this.contactFName = contactFName;
        this.contactLName = contactLName;
        this.email = email;
        this.deploymentInfo = deploymentInfo;
    }

    getTitle():string{
        return this.title;
    }

    getContactFName():string{
        return this.contactFName;
    }

    getContactLName():string{
        return this.contactLName;
    }

    getEmail():string{
        return this.email;
    }

    getDeploymentInfo():Deployment{
        return this.deploymentInfo;
    }

    getDeploymentCoords():number[]{
        return this.deploymentInfo.getCoordinates();
    }

    setTitle(newTitle:string){
        this.title = newTitle;
    }

    setContactFName(newFName:string){
        this.contactFName = newFName;
    }

    setContactLName(newLName:string){
        this.contactLName = newLName;
    }

    setEmail(newEmail:string){
        this.email = newEmail;
    }

    setDeploymentInfo(newDeployment:Deployment){
        this.deploymentInfo = newDeployment;
    }
}