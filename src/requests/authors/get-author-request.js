import RequestRestBase from "../../core/request-rest-base.js";

const url = __ENV.BASE_URL;

export default class GetAuthor extends RequestRestBase {

     constructor() {
        super();
        this.url = url;
        this.requestService = `/api/v1/Authors`;
        this.setMethod('GET');
        this.tag = 'GetAuthor';
    }
}