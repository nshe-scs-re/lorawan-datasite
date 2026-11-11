import { Project } from "./Project";
import { Deployment } from "./Deployment";

export class ProjectHistory{
    project:Project;
    contactFName:string;
    contactLName:string;
    email:string;
    deploymentInfo:Deployment;

    constructor(project: Project, contactFName: string, contactLName: string, email: string, deploymentInfo: Deployment){
        this.project = project;
        this.contactFName = contactFName;
        this.contactLName = contactLName;
        this.email = email;
        this.deploymentInfo = deploymentInfo;
    }

    getProject():Project{
        return this.project;
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

    getDeploymentCoords():[number, number]{
        return this.deploymentInfo.getCoordinates();
    }

    setProject(newProject:Project){
        this.project = newProject;
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