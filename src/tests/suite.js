import { group } from "k6";
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import updateActivity from '../tests/activities/put-activities.test.js';
import sendAuthor from '../tests/authors/post-author.test.js';


/**
IMPORTANT!
If you want to control the Load through the suite.js, you have to unconsider the options defined in the individual test files.
*/

export let options = {
    scenarios: {
        createActivity: {
            executor: 'constant-arrival-rate',
            rate: 5,
            timeUnit: '1s',
            duration: '30s',
            preAllocatedVUs: 5,
            maxVUs: 10,
            stages: [{ target: 10, duration: '30s' }, { target: 0, duration: '10s' }]
        }
    },

    createAuthor: {
        executor: 'constant-arrival-rate',
        rate: 5,
        timeUnit: '1s',
        duration: '30s',
        preAllocatedVUs: 5,
        maxVUs: 10,
        stages: [{ target: 10, duration: '30s' }, { target: 0, duration: '10s' }]
    }
};

export function createActivity() {
    group('Create Activity', () => {
        updateActivity();
    });
}

export function createAuthor() {
    group('Create Author', () => {
        sendAuthor();
    });
}

export function handleSummary(data) {
    return {
        'relatorio.html': htmlReport(data)
    };
}