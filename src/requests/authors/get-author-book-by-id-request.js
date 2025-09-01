import RequestRestBase from "../../core/request-rest-base.js";

const url = __ENV.BASE_URL;

export default class GetBookByAuthorId extends RequestRestBase {

     constructor(bookId) {
        super();
        this.url = url;
        this.requestService = `/api/v1/Authors/authors/books/${bookId}`;
        this.setMethod('GET');
        this.tag = 'GetBookByAuthorId';
    }
}