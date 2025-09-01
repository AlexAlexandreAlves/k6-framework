import { check } from 'k6';
import { expect } from 'https://jslib.k6.io/k6-testing/0.5.0/index.js';
import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import { randomItem } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import UpdateAuthors from '../../requests/authors/put-author-request.js';
import Utils from '../../utils/utils.js';

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

const id = Utils.readCsv('id-authors.csv');

export default function UpdateAuthors() {

    const randomId = randomItem(id);
    const request = new UpdateAuthors(randomId);

    request.setJsonBodyFromTemplate(
        "Generic title updated",
        false
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


    throughput.add(response.timings.duration);
    latency.add(response.timings.waiting);
    ttfb.add(response.timings.receiving);
    connectTime.add(response.timings.connecting);
    sendTime.add(response.timings.sending);
    receiveTime.add(response.timings.receiving);
    responseBodySize.add(response.body ? response.body.length : 0);
    requestBodySize.add(request.jsonBody ? request.jsonBody.length : 0);

    console.log("Status code: " + response.status, "Response body: " + response.body);

    expect(response.status).toEqual(200);
    check(response, {
        'Body is not null': (r) => r.body != null,
    });
};

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