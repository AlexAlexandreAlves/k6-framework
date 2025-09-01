import RequestRestBase from "../../core/request-rest-base.js";

const url = __ENV.BASE_URL;

var template = open('../../json-objects/activities/put-activities.json');

export default class UpdateActivities extends RequestRestBase {

    constructor(id) {
        super();
        this.url = url;
        this.requestService = `/api/v1/Activities/${id}`;
        this.setMethod('PUT');
        this.tag = 'UpdateActivities';
    }

    setJsonBodyFromTemplate(title, completed) {
        const body = { ...template };
        body.title = title;
        body.completed = completed;
        this.jsonBody = JSON.stringify(body);
    }
}