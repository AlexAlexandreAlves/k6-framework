import http from 'k6/http';
import { Httpx } from 'https://jslib.k6.io/httpx/0.0.4/index.js';
import '../config/setup.js';
import { recordMetrics } from './metrics-recorder.js';

/**
 * 
 * @typedef {Object} ApiClientConfig
 * @property {string | null } baseURL
 * @property {Record<string, string>} [headers] 
 * @property {number} [timeout] 
 * @property {string | null} [authenticationUser]
 * @property {string | null} [authenticationPassword]
 * @property {'BEARER' | 'NONE'} [authenticationType]
 */

const tokenEnv = __ENV.TOKEN || '';

/**
 * Creates an Api client with authentication if needed
 * @param {ApiClientConfig} config - Configuration for the API client
 * @returns {Httpx} Configured Httpx session
 */

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

/**
 * @typedef {'GET' | 'POST' | 'PUT' | 'DELETE'} HttpMethod
 * @typedef {Object} ResponseMetrics
 * @property {number} status
 * @property {string} [body]
 * @property {Object} timings
 * @property {number} timings.duration
 * @property {number} timings.waiting
 * @property {number} timings.connecting
 * @property {number} timings.sending
 * @property {number} timings.receiving
 */

export default class RequestRestBase {
    /**
     * @type {string | null}
     */
    url = null;
    /**
     * @type {string | null}
    */
    requestService = null;
    /**
     * @type {HttpMethod | null}
    */
    method = null;
    /**
     * @type {string | object | null}
    */
    jsonBody = null;
    /**
     * @type {string | ArrayBuffer | null}
    */
    file = null;
    /**
     * @type {string | null}
    */
    fileName = null;
    /**
     * @type {string | null}
    */
    fileType = null;
    /**
     * @type {Record<string, string>}
    */
    headers = { 'Content-Type': 'application/json; charset=utf-8' };
    /**
    * @type {Record<string, string>}
   */
    cookies = {};
    /**
    * @type {Record<string, any>}
   */
    queryParameters = {};
    /**
    * @type {Record<string, any>}
   */
    formParameters = {};
    /**
    * @type {'BEARER' | 'NONE'}
   */
    authenticationType = 'BEARER';
    /**
     * @type {string | null}
    */
    authenticationUser = null;
    /**
    * @type {string | null}
   */
    authenticationPassword = null;
    /**
    * @type {string | null}
   */
    tag = null;
    /**
    * @type {number | undefined}
   */
    timeout = undefined;



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

    /** 
    * @param {HttpMethod} method
   */
    setMethod(method) {
        this.method = method;
    }

    /** 
    * @param {Record<string, any>} parameters
   */
    setFormParameters(parameters) {
        this.formParameters = parameters;
        this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    /** 
    * @param {string} header
   */
    removeHeader(header) {
        delete this.headers[header];
    }

    /** 
    * @param {string} cookie
   */
    removeCookie(cookie) {
        delete this.cookies[cookie];
    }

    /** 
    * @param {string} parameter
   */
    removeQueryParameter(parameter) {
        delete this.queryParameters[parameter];
    }

    /** 
     * @returns {ResponseMetrics}
    */
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

    /** 
   * @param {Httpx} session
   * @returns {ResponseMetrics}
  */
    _executeRequest(session) {
        if (!this.requestService) {
            throw new Error('Request service URL is not defined!');
        }

        if (!this.tag) {
            throw new Error('Request tag is not defined!');
        }

        /** 
          * @type {{headers: Record<string, string>, cookies: Record<string, string>, params:Record<string, any>, files?: Record<string, any> }} 
         */
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
            if(this.fileName && this.fileType) {
            requestOptions.files[this.fileName] = http.file(this.file, this.fileName, this.fileType);
            }
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