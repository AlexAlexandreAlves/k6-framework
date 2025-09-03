import http from 'k6/http';
import { Httpx } from 'https://jslib.k6.io/httpx/0.0.4/index.js';
import '../config/setup.js';
import { recordMetrics } from './metrics-recorder.js'; 

const tokenEnv = __ENV.TOKEN;

function createApiClient(config) {
    const {
        baseURL,
        headers,
        timeout,
        authenticationUser,
        authenticationPassword,
        authenticationType
    } = config;

    let session = new Httpx({
        baseURL: baseURL,
        headers: headers || {},
        timeout: timeout || 20000,
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
            baseURL: this.url,
            headers: this.headers,
            timeout: this.timeout,
            authenticationUser: this.authenticationUser,
            authenticationPassword: this.authenticationPassword,
            authenticationType: this.authenticationType
        });

        const response = this._executeRequest(session);
        recordMetrics(this, response);

        return response;
    }

    _executeRequest(session) {
        let requestOptions = {
            headers: { ...this.headers },
            cookies: this.cookies,
            params: this.queryParameters
        };

        let body;

        if (Object.keys(this.formParameters).length > 0) {
            body = this.formParameters;
            requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else if (this.jsonBody) {
            body = this.jsonBody;
            requestOptions.headers['Content-Type'] = 'application/json; charset=utf-8';
        } else if (this.file) {
            body = {};
            requestOptions.files = {};
            requestOptions.files[this.fileName] = http.file(this.file, this.fileName, this.fileType);
        }

        let res;

        switch (this.method) {
            case 'GET':
                res = session.get(this.requestService, requestOptions, {
                    tags: { name: this.tag }
                });
                break;
            case 'POST':
                res = session.post(this.requestService, body, {
                    headers: requestOptions.headers,
                    cookies: requestOptions.cookies,
                    params: requestOptions.params,
                    tags: { name: this.tag }
                });
                break;
            case 'PUT':
                res = session.put(this.requestService, body, {
                    headers: requestOptions.headers,
                    cookies: requestOptions.cookies,
                    params: requestOptions.params,
                    tags: { name: this.tag }
                });
                break;
            case 'DELETE':
                res = session.delete(this.requestService, null, {
                    headers: requestOptions.headers,
                    cookies: requestOptions.cookies,
                    params: requestOptions.params,
                    tags: { name: this.tag }
                });
                break;
            default:
                throw new Error(`HTTP method ${this.method} not implemented!`);
        }
        return res;
    }
}