import { check } from 'k6';
import { expect } from 'https://jslib.k6.io/k6-testing/0.5.0/index.js';
import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import PostActivities from '../../requests/activities/post-activities-request.js';

export let options = {
    scenarios: {
        light_load: {
            executor: 'constant-arrival-rate',
            rate: 5,
            timeUnit: '1s',
            duration: '10s',
            preAllocatedVUs: 5,
            maxVUs: 10,
        }
    }
}

// Custom Metric
const errorCounter = new Counter('errors');
const successCounter = new Counter('success');
const throughput = new Trend('throughput');
const latency = new Trend('latency');
const ttfb = new Trend('ttfb');
const connectTime = new Trend('connect_time');
const sendTime = new Trend('send_time');
const receiveTime = new Trend('receive_time');
const responseBodySize = new Trend('response_body_size');
const requestBodySize = new Trend('request_body_size');

export default function sendActivity() {

    const currentDate = new Date();
    const request = new PostActivities();

    request.setJsonBodyFromTemplate(
        0,
        "Generic title",
        currentDate,
        true
    )

    const response = request.executeRequest();
    if (response.status != 200) {
        let responseBody = response.body ? response.body : "";
        errorCounter.add(true,
            {
                name: request.tag,
                error_code: response.status,
                response_body: response.body
            });
    } else {
        successCounter.add(true, { name: request.tag });
    }


    // Additional metrics
    throughput.add(response.timings.duration);
    latency.add(response.timings.waiting); // waiting time (latency)
    ttfb.add(response.timings.receiving); // time to first byte (TTFB)
    connectTime.add(response.timings.connecting); // connection time
    sendTime.add(response.timings.sending); // request sending time
    receiveTime.add(response.timings.receiving); // response receiving time
    responseBodySize.add(response.body ? response.body.length : 0); // response body size
    requestBodySize.add(request.jsonBody ? request.jsonBody.length : 0); // request body size

    // Log the status code and response body example
    console.log("Status code: " + response.status, "Response body: " + response.body);

    // expected assertions
    expect(response.status).toEqual(200);
    // check assert example
    check(response, {
        'Body is not null': (r) => r.body != null,
    });
};

// Another metric assert example
export function handleSummary(data) {
    const p95 = data.metrics.latency ? data.metrics.latency['p(95)'] : null;

    if (p95 !== null) {
        if (p95 <= 200) {
            console.log(`ALTER: The latency p95 was less than 200ms (${p95}ms)`);
        }
    }

    return {
        'report.html': htmlReport(data)
    };
}