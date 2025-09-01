import http from 'k6/http';


/**
   // 
   @param {boolean} discardResponseBodies - Whether to discard response bodies.
   @param {Object} scenarios - The scenarios to run.
   @param {String} executor - The executor to use for the test.
   @param {Number} rate - The rate of requests per time unit.
   @param {String} timeUnit - The time unit for the rate (e.g., "1s", "1m").
   @param {String} duration - The duration of the test.
   @param {Number} preAllocatedVUs - The number of pre-allocated virtual users.
   @param {Number} maxVUs - The maximum number of virtual users.

   When use constant-arrival? 
   When you want to simulate a specific request rate over time, regardless of the response times of the requests.
   This approach is more useful for a RPS representation more accurate, for example. It's important to know that you dont have to use 'Sleeps',
   because the executors manage the pacing of requests for you through 'rate' and 'timeUnit'.
   */
export const options = {
    discardResponseBodies: true,
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

export default function () {
    http.get('https://test.k6.io');
}
