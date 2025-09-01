import http from 'k6/http';


/**
   // 
   @param {boolean} discardResponseBodies - Whether to discard response bodies.
   @param {Object} scenarios - The scenarios to run.
   @param {String} executor - The executor to use for the test.
   @param {String} exec - The function to execute for each virtual user.
   @param {Number} vus - The number of virtual users to simulate.
   @param {Number} iterations - The number of iterations each virtual user will execute.

   When use per-vu-iterations? 
   When you want to control the number of iterations each virtual user will execute, allowing for more granular load testing.
   */
export const options = {
    discardResponseBodies: true,
    scenarios: {
        light_load: {
            executor: 'per-vu-iterations',
            exec: 'request',
            vus: 5,
            iterations: 10,
        }
    }
}

export default function () {
    http.get('https://test.k6.io');
}
