import RequestRestBase from "../../core/request-rest-base.js";

const url = __ENV.BASE_URL;

var template = open('../../json-objects/activities/post-activities.json');

export default class SendActivities extends RequestRestBase {

     constructor() {
        super();
        this.url = url; 
        this.requestService = `/api/v1/Activities`;
        this.setMethod('POST');
        this.tag = 'SendActivities';
    }

    setJsonBodyFromTemplate(id, title, dueDate, completed) {
        const body = { ...template };
        body.id = id;
        body.title = title;
        body.dueDate = dueDate;
        body.completed = completed;
        this.jsonBody = JSON.stringify(body);
    }
}