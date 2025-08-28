import RequesRestBase from "../../core/request-rest-base.js";

const url = __ENV.BASE_URL;
const template = open('../../json-objects/activities/post-activities.json');

export default class PostEnvioActivities extends RequesRestBase {
    constructor() {
        super();
        // this.baseUrl = url;
        this.endpoint = 'https://fakerestapi.azurewebsites.net/api/v1/Activities';
        this.setMethod('POST');
        this.tag = 'PostEnvioActivities';
    }

   setJsonBodyFromTemplate(id, title, dueDate, completed) {
        // Crie uma cópia do template
        const body = { ...template };
        body.id = id;
        body.title = title;
        body.dueDate = dueDate;
        body.completed = completed;
        this.jsonBody = JSON.stringify(body); // Envie como string JSON
    }
}