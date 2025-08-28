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
        this.baseUrl = null;
        this.timeout = 2000;
        this.endpoint = null; 
        this.method = null;
        this.jsonBody = null;
        this.file = null;
        this.fileName = null;
        this.fileType = null;
        this.headers = {};
        this.cookies = {};
        this.queryParameters = {};
        this.formParameters = {};
        // this.authenticationType = 'BEARER';
        this.authenticationUser = null;
        this.authenticationPassword = null;
        this.tag = null;
    }

    setMethod(method) {
        this.method = method;
    }

    setFormParameters(parameters) {
        this.formParameters = parameters;
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

    _buildRequestOptions() {
        const options = {
            headers: { ...this.headers },
            cookies: this.cookies,
            params: this.queryParameters,
        };

        if (this.file) {
            options.files = {
                [this.fileName]: http.file(this.file, this.fileName, this.fileType)
            };
            options.headers['Content-Type'] = this.fileType || 'multipart/form-data';
        } else if (this.jsonBody) {
            options.body = this.jsonBody;
            options.headers['Content-Type'] = 'application/json; charset=utf-8';
        } else if (Object.keys(this.formParameters).length > 0) {
            options.body = this.formParameters;
            options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        return options;
    }

    executeRequest() {
        const session = createApiClient({
            baseUrl: this.baseUrl,
            headers: this.headers,
            timeout: this.timeout,
            authenticationUser: this.authenticationUser,
            authenticationPassword: this.authenticationPassword,
            // authenticationType: this.authenticationType
        });

        return this._executeRequest(session);
    }

    _executeRequest(session) {
        const options = this._buildRequestOptions();
        const tags = { tags: { name: this.tag } };
        const methodMap = {
            GET: () => session.get(this.endpoint, options, tags),
            POST: () => session.post(this.endpoint, options.body, tags),
            PUT: () => session.put(this.endpoint, options.body, tags),
            DELETE: () => session.delete(this.endpoint, null, tags),
        };

        if (!methodMap[this.method]) {
            throw new Error(`HTTP method ${this.method} not implemented!`);
        }
        return methodMap[this.method]();
    }
}
