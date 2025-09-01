import RequestRestBase from "../../core/request-rest-base.js";

const url = __ENV.BASE_URL;

export default class GetAuthorById extends RequestRestBase {

     constructor(id) {
        super();
        this.url = url;
        this.requestService = `/api/v1/Authors/${id}`;
        this.setMethod('GET');
        this.tag = 'GetAuthorById';
    }
}