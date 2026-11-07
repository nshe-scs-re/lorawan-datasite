// Author: Jacob

export class SensorComment{
    postedDate:Date;
    comment:string;

    constructor(postedDate:Date, comment:string){
        this.postedDate = postedDate;
        this.comment = comment;
    }

    getPostedDate():Date{
        return this.postedDate;
    }

    getComment():string{
        return this.comment;
    }

    setPostedDate(newDate:Date){
        this.postedDate = newDate;
    }

    setComment(newComment:string){
        this.comment = newComment;
    }
}