import { check } from 'k6';
import { expect } from 'https://jslib.k6.io/k6-testing/0.5.0/index.js';
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

export default function createActivity() {

    const currentDate = new Date();
    const request = new PostActivities();

    request.setJsonBodyFromTemplate(
        0,
        "Generic title",
        currentDate,
        true
    )

    const response = request.executeRequest();

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