import RequestRestBase from "../../core/request-rest-base.js";

const url = __ENV.BASE_URL;

var template = open('../../json-objects/authors/post-authors.json');

export default class PostAuthor extends RequestRestBase {

     constructor() {
        super();
        this.url = url; 
        this.requestService = `/api/v1/Authors`;
        this.setMethod('POST');
        this.tag = 'PostAuthor';
    }

    setJsonBodyFromTemplate(idBook, firstName, lastName) {
        const body = { ...template };
        body.idBook = idBook;
        body.firstName = firstName;
        body.lastName = lastName;
        this.jsonBody = JSON.stringify(body);
    }
}