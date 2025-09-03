import { Counter, Trend } from 'k6/metrics';

export const errorCounter = new Counter('errors');
export const successCounter = new Counter('success');

export const throughput = new Trend('throughput');
export const latency = new Trend('latency');
export const ttfb = new Trend('ttfb');
export const connectTime = new Trend('connect_time');
export const sendTime = new Trend('send_time');
export const receiveTime = new Trend('receive_time');
export const responseBodySize = new Trend('response_body_size');
export const requestBodySize = new Trend('request_body_size');