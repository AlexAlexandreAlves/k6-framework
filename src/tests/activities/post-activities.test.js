import { check } from 'k6';
import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import SendActivities from '../../requests/activities/post-activities.js';

export let options = {
    scenarios: {
        light_load: {
            executor: 'constant-arrival-rate',
            rate: 5,
            timeUnit: '1s',
            duration: '30s',
            preAllocatedVUs: 5,
            maxVUs: 10,
        }
    }
}

const errorCounter = new Counter('errors');
// const successCounter = new Counter('success');
const throughput = new Trend('throughput');

export default function sendActivity() {

    // const currentDate = new Date();

    const request = new SendActivities();

    request.setJsonBodyFromTemplate(
        0,
        "Generic title",
        "2025-08-28",
        true
    )

    // console.log("Request body: " + request.jsonBody);
    const response = request.executeRequest();
    // if (response.status != 200) {
    //     let responseBody = response.body ? response.body : "";
    //     errorCounter.add(true,
    //         {
    //             // name: request.tag,
    //             error_code: response.status,
    //             response_body: response.body
    //         });
    // }

    console.log("Status code: " + response.status, "Response body: " + response.body);

    check(response, {
        'status 200': (r) => r.status === 200,
    });
    throughput.add(response.timings.duration);
}

export function handleSummary(data) {
    return {
        'relatorio.html': htmlReport(data)
    };
}
