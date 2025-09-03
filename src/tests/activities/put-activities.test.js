import { check } from 'k6';
import { expect } from 'https://jslib.k6.io/k6-testing/0.5.0/index.js';
import { randomItem } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import UpdateActivities from '../../requests/activities/put-activities-request.js';
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

const id = Utils.readCsv('id-activity.csv');

export default function updateActivity() {

    const randomId = randomItem(id);
    const request = new UpdateActivities(randomId);

    request.setJsonBodyFromTemplate(
        "Generic title updated",
        false
    )

    const response = request.executeRequest();

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