import http from 'k6/http';
import { Httpx } from 'https://jslib.k6.io/httpx/0.0.4/index.js';

const tokenEnv = __ENV.TOKEN;

function createApiClient(config) {
    const {
        baseUrl,
        headers,
        timeout,
        authenticationUser,
        authenticationPassword,
        authenticationType
    } = config;

    let session = new Httpx({
        baseUrl: baseUrl,
        headers: headers || {},
        timeout: timeout || 2000,
    });

    if (authenticationType) {
        switch (authenticationType) {
            case 'BEARER':
                session.addHeader('Authorization', `Bearer ${tokenEnv}`);
                break;
            case 'NONE':
            default:
                break;
        }
    }
    return session;

}

export default class RequestRestBase {
    constructor() {
        this.url = null;
        this.requestService = null;
        this.method = null;
        this.jsonBody = null;
        this.file = null;
        this.fileName = null;
        this.fileType = null;
        this.headers = { 'Content-Type': 'application/json; charset=utf-8' };
        this.cookies = {};
        this.queryParameters = {};
        this.formParameters = {};
        this.authenticationType = 'BEARER';
        this.authenticationUser = null;
        this.authenticationPassword = null;
        this.tag = null;
    }

    setMethod(method) {
        this.method = method;
    }

    setFormParameters(parameters) {
        this.formParameters = parameters;
        this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    removeHeader(header) {
        delete this.headers[header];
    }

    removeCookie(cookie) {
        delete this.cookies[cookie];
    }

    removeQueryParameter(parameter) {
        delete this.queryParameters[parameter];
    }


    executeRequest() {
        const session = createApiClient({
            baseUrl: this.baseUrl,
            headers: this.headers,
            timeout: this.timeout,
            authenticationUser: this.authenticationUser,
            authenticationPassword: this.authenticationPassword,
            authenticationType: this.authenticationType
        });

        return this._executeRequest(session);
    }

    _executeRequest(session) {

        let requestOptions = {
            headers: this.headers,
            cookies: this.cookies,
            params: this.queryParameters,
            body: {}
        };

        if (this.file) {
            requestOptions.files = {};
            requestOptions.files[this.fileName] = http.file(this.file, this.fileName, this.fileType);
        }

        if (this.jsonBody) {
            requestOptions.body = this.jsonBody;
            requestOptions.headers['Content-Type'] = 'application/json; charset=utf-8';
        }

        if (Object.keys(this.formParameters).length > 0) {
            requestOptions.body = this.formParameters;
        }

        let res;

        switch (this.method) {
            case 'GET':
                res = session.get(this.requestService, requestOptions, {
                    tags: {
                        name: this.tag,
                    },
                });
                break;
            case 'POST':
                res = session.post(this.requestService, requestOptions.body, {
                    tags: {
                        name: this.tag,
                    }
                });
                break;
            case 'PUT':
                res = session.put(this.requestService, requestOptions.body, {
                    tags: {
                        name: this.tag,
                    }
                });
                break;
            case 'DELETE':
                res = session.delete(this.requestService, null, {
                    tags: {
                        name: this.tag,
                    }
                });
                break;
            default:
                throw new Error(`HTTP method ${this.method} not implemented!`);
        }

        return res;
    }
}
