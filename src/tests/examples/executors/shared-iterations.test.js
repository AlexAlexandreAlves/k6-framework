import http from 'k6/http';


/**
   // 
   @param {boolean} discardResponseBodies - Whether to discard response bodies.
   @param {Object} scenarios - The scenarios to run.
   @param {String} executor - The executor to use for the test.
   @param {Number} iterations - The number of iterations to run.
   @param {String} vus - The number of virtual users to simulate.

   When use shared-iterations? 
   When you want to simulate a scenario where multiple virtual users share the same iteration, allowing for more realistic load testing.
   */

export const options = {
    discardResponseBodies: true,
    scenarios: {
        light_load: {
            executor: 'shared-iterations',
            iterations: 100,
            vus: 5,
        }
    }
}

export default function () {
    http.get('https://test.k6.io');
}
