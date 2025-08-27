import RequesRestBase from "../../core/request-rest-base.js";

const url = __ENV.BASE_URL;
const template = open('../../json-objects/activities/post-activities.json');

export default class PostEnvioActivities extends RequesRestBase {
    constructor() {
        super();
        this.url = url;
        this.endpoint = '/activities';
        this.setMethod('POST');
        this.tag = 'PostEnvioActivities';
    }

    setJsonBodyFromTemplate(id, idBook, title, description) {
        var body = template;
        body = body.replace("$id", id);
        body = body.replace("$idBook", idBook);
        body = body.replace("$title", title);
        body = body.replace("$description", description);
        this.jsonBody = body;
    }
}