import RequestRestBase from "../../core/request-rest-base.js";

const url = __ENV.BASE_URL;

var template = open('../../json-objects/authors/put-authors.json');

export default class UpdateAuthors extends RequestRestBase {

    constructor(id) {
        super();
        this.url = url;
        this.requestService = `/api/v1/Authors/${id}`;
        this.setMethod('PUT');
        this.tag = 'UpdateAuthors';
    }

    setJsonBodyFromTemplate(firstName, lastName) {
        const body = { ...template };
        body.firstName = firstName;
        body.lastName = lastName;
        this.jsonBody = JSON.stringify(body);
    }
}