import { group } from "k6";
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import sendActivity from '../tests/activities/post-activities.test.js';

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
        sendActivity();
    });
}

export function createAuthor() {
    group('Create Author', () => {
        // Your test logic for creating an author goes here
    });
}

export function handleSummary(data) {
    return {
        'relatorio.html': htmlReport(data)
    };
}