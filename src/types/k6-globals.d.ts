// k6 runtime globals and external modules used in this project

declare const __ENV: Record<string, string | undefined>;
declare function open(path: string, enconding?: string): string;

interface Console {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
}

declare const console: Console;

declare module 'k6' {
    export const check: (
        res: any,
        checks: Record<string, (res: any) => boolean>,
    ) => boolean;

    export function group<T>(name: string, fn: () => T): T;
}

declare module 'k6/http' {
    export function file(data: string | ArrayBuffer, filename?: string, contentType?: string): any;
}

declare module 'k6/metrics' {
    export class Counter {
        constructor(name: string);
        add(value: number, tags?: Record<string, any>): void;
    }

    export class Trend {
        constructor(name: string);
        add(value: number, tags?: Record<string, any>): void;
    }
}

declare module 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js' {
    export function htmlReport(data: any): string;
}

declare module 'k6/data' {
    export class SharedArray<T> {
        constructor(name: string, fn: () => T[]);
        [index: number]: T;
        length: number;
    }
}

declare module 'https://jslib.k6.io/papaparse/5.1.1/index.js' {
    export interface ParseConfig {
        header?: boolean;
        skipEmptyLines?: boolean;
    }

    export interface ParseResult<T> {
        data: T[];
        errors: any[];
    }

    export const parse: <T = any>(input: string, config?: ParseConfig) => ParseResult<T>;
}

declare module 'https://jslib.k6.io/k6-utils/1.1.0/index.js' {
    import { SharedArray } from "k6/data";
    export function randomItem<T>(array: T[] | SharedArray<T>): T;
    export function sleep(seconds: number): void;
}

declare module 'https://jslib.k6.io/http/1.9.0/httpx.js' {
    export function get(url: string): any;
    export function post(url: string, body: any): any;
    export function put(url: string, body: any): any;
    export function patch(url: string, body: any): any;
}

declare module 'https://jslib.k6.io/httpx/0.0.4/index.js' {
    export interface HttpxConfig {
        baseURL?: string | null;
        headers?: Record<string, string>;
        timeout?: number;
    }

    export interface HttpxRequestOptions {
        headers?: Record<string, string>;
        cookies?: Record<string, string>;
        params?: Record<string, any>;
        files?: Record<string, any>;
        tags?: Record<string, string>;
    }

    export class Httpx {
        constructor(config?: HttpxConfig);
        addHeader(name: string, value: string): void;
        get(url: string, options?: HttpxRequestOptions, params?: HttpxRequestOptions): ResponseMetrics;
        post(url: string, body: any, options?: HttpxRequestOptions): ResponseMetrics;
        put(url: string, body: any, options?: HttpxRequestOptions): ResponseMetrics;
        patch(url: string, body: any, options?: HttpxRequestOptions): ResponseMetrics;
        delete(url: string, body: any, options?: HttpxRequestOptions): ResponseMetrics;
    }
}

// Types for metrics recorder
interface RequestMetrics {
    tag: string | null;
    jsonBody?: string | object | null;
}

interface ResponseTimings {
    duration: number;
    waiting: number;
    connecting: number;
    sending: number;
    receiving: number;
}

interface ResponseMetrics {
    status: number;
    body?: string;
    timings: ResponseTimings;
}

//Types for RequestRestBase
interface ApiClientConfig {
    baseURL?: string | null;
    headers?: Record<string, string>;
    timeout?: number;
    authenticationUser?: string | null;
    authenticationPassword?: string | null;
    authenticationToken?: 'BEARER' | 'NONE';
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';