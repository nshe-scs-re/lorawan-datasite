export class Project{
    title:string;

    constructor(title:string){
        this.title = title;
    }

    getTitle():string{
        return this.title;
    }

    setTitle(newTitle:string){
        this.title = newTitle;
    }
}