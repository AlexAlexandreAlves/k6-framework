import { check } from 'k6';
import { expect } from 'https://jslib.k6.io/k6-testing/0.5.0/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { randomItem } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import PostAuthors from '../../requests/authors/post-author-request.js';
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


const authorsDataDriven = Utils.readCsv('post-author.csv');

export default function sendAuthor() {

    const author = randomItem(authorsDataDriven)

    const request = new PostAuthors();

    request.setJsonBodyFromTemplate(
        author[0], // idBook
        author[1], // firstName
        author[2], // lastName
    )

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